import { getApiUrl } from "../utils/helpers.js";
import {
  obtenerCategorias,
  crearCategoria,
} from "../categorias/categorias.api.js";
import { renderCategorias } from "../categorias/categorias.ui.js";
import { showToast } from "../utils/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = getApiUrl();

  const form = document.getElementById("formCategoria");
  const inputImagen = document.getElementById("imagenCategoria");
  const contenedor = document.getElementById("lista-categorias");

  let enviando = false;

  // 🔹 cargar lista
  async function cargarCategoriasUI() {
    if (!contenedor) return;

    try {
      const categorias = await obtenerCategorias(apiUrl);
      renderCategorias(contenedor, categorias, apiUrl);
    } catch (error) {
      showToast("Error al cargar categorías", "error");
    }
  }

  cargarCategoriasUI();

  // 🔹 si no hay form → solo lista
  if (!form || !inputImagen) return;

  // 🔥 FILEPOND
  const pond = FilePond.create(inputImagen, {
    allowMultiple: false,
    instantUpload: false,
    storeAsFile: true,
    acceptedFileTypes: ["image/*"],
  });

  // 🔹 submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (enviando) return;
    enviando = true;

    const btn = form.querySelector("button");
    btn.disabled = true;

    const nombre = form.nombre_categoria.value.trim();
    const descripcion = form.descripcion.value.trim();

    try {
      // 1️⃣ crear categoría
      const data = await crearCategoria(apiUrl, {
        nombre_categoria: nombre,
        descripcion,
      });

      const categoriaId =
        data.categoria?.id_categoria || data.id_categoria || data.categoria?.id;

      if (!categoriaId) throw new Error("No se obtuvo ID");

      // 2️⃣ subir imagen
      if (pond.getFiles().length > 0) {
        const archivo = pond.getFiles()[0].file;

        const formData = new FormData();
        formData.append("file", archivo);

        const res = await fetch(
          `${apiUrl}/categorias/subir-imagen/${categoriaId}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Error al subir imagen");
      }

      showToast("Categoría creada correctamente", "success");

      form.reset();
      pond.removeFiles();

      await cargarCategoriasUI();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      enviando = false;
      btn.disabled = false;
    }
  });
});
