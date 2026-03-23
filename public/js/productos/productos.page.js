import { getApiUrl } from "../utils/helpers.js";
import {
  obtenerCategorias,
  obtenerMarcas,
  crearProducto,
} from "../productos/productos.api.js";
import {
  renderCategoriasSelect,
  renderMarcasSelect,
} from "../productos/productos.ui.js";
import { showToast } from "../utils/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = getApiUrl();

  const form = document.getElementById("formProducto");
  const inputImagen = document.getElementById("imagen");

  const categoriaSelect = document.getElementById("categoriaSelect");
  const marcaSelect = document.getElementById("marcaSelect");

  if (!form || !inputImagen) return;

  let enviando = false;

  const pond = FilePond.create(inputImagen);

  /* =========================
     CARGA INICIAL
  ========================= */
  cargarDatos();

  async function cargarDatos() {
    try {
      const [categorias, marcas] = await Promise.all([
        obtenerCategorias(apiUrl),
        obtenerMarcas(apiUrl),
      ]);

      renderCategoriasSelect(categoriaSelect, categorias);
      renderMarcasSelect(marcaSelect, marcas);
    } catch (error) {
      showToast("Error cargando datos", "error");
    }
  }

  /* =========================
     SUBMIT
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (enviando) return;
    enviando = true;

    const btn = form.querySelector("button");
    btn.disabled = true;

    const formData = new FormData(form);

    if (pond.getFiles().length > 0) {
      formData.set("imagen", pond.getFiles()[0].file);
    }

    try {
      const data = await crearProducto(apiUrl, formData);

      showToast("Producto creado correctamente", "success");

      window.location.href = `/admin/productos/editar/${data.producto.id_producto}`;
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      enviando = false;
      btn.disabled = false;
    }
  });
});
