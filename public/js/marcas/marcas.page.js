import { getApiUrl } from "../utils/helpers.js";
import {
  obtenerMarcas,
  crearMarca,
  subirLogoMarca,
} from "../marcas/marcas.api.js";
import { renderMarcas } from "../marcas/marcas.ui.js";
import { showToast } from "../utils/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = getApiUrl();

  const form = document.getElementById("formMarca");
  const inputImagen = document.getElementById("imagenMarca");
  const contenedor = document.getElementById("lista-marcas");

  if (!form) return;

  let enviando = false;

  const pond = FilePond.create(inputImagen, {
    allowMultiple: false,
    instantUpload: false,
    acceptedFileTypes: ["image/*"],
    labelIdle: "Arrastra o haz clic para seleccionar el logo",
  });

  /* ===============================
     Cargar marcas
  ================================= */
  async function cargarMarcasUI() {
    try {
      const marcas = await obtenerMarcas(apiUrl);
      renderMarcas(contenedor, marcas, apiUrl);
    } catch (error) {
      showToast("Error al cargar marcas", "error");
    }
  }

  cargarMarcasUI();

  /* ===============================
     Submit
  ================================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (enviando) return;
    enviando = true;

    const btn = form.querySelector("button");
    btn.disabled = true;

    const nombre = form.nombre_marca.value.trim();
    const descripcion = form.descripcion.value.trim();

    if (!nombre) {
      showToast("El nombre es obligatorio", "error");
      enviando = false;
      btn.disabled = false;
      return;
    }

    try {
      const data = await crearMarca(apiUrl, {
        nombre_marca: nombre,
        descripcion,
      });

      const marcaId = data.marca?.id_marca || data.id_marca || data.marca?.id;

      if (!marcaId) throw new Error("No se obtuvo ID");

      if (pond.getFiles().length > 0) {
        const archivo = pond.getFiles()[0].file;
        await subirLogoMarca(apiUrl, marcaId, archivo);
      }

      showToast("Marca creada correctamente", "success");

      form.reset();
      pond.removeFiles();

      await cargarMarcasUI();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      enviando = false;
      btn.disabled = false;
    }
  });
});
