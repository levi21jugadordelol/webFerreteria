import { getApiUrl } from "../utils/helpers.js";
import { obtenerCategorias } from "../categorias/categorias.api.js";
import { renderCategorias } from "../categorias/categorias.ui.js";
import { showToast } from "../utils/toast.js";

document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = getApiUrl();
  const contenedor = document.getElementById("lista-categorias");

  if (!contenedor) return;

  try {
    const categorias = await obtenerCategorias(apiUrl);

    renderCategorias(contenedor, categorias, apiUrl);

    // opcional: mensaje si está vacío
    if (categorias.length === 0) {
      showToast("No hay categorías registradas", "error");
    }
  } catch (error) {
    // log solo en desarrollo
    if (import.meta.env?.DEV) {
      console.error(error);
    }

    showToast("Error al cargar categorías", "error");
  }
});
