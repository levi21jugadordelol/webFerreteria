import { getImageUrl, escapeHTML } from "../utils/helpers.js";

export function renderMarcas(container, marcas, apiUrl) {
  if (!container) return;

  container.innerHTML =
    marcas.length > 0
      ? marcas
          .map(
            (m) => `
        <div class="card p-3 shadow-sm text-center" style="width:200px">
          <img src="${getImageUrl(apiUrl, m.url_logo)}" 
               class="img-fluid rounded mb-2" />
          <h6 class="fw-bold">${escapeHTML(m.nombre_marca)}</h6>
          <p class="text-muted small">
            ${escapeHTML(m.descripcion || "Sin descripción")}
          </p>
        </div>
      `,
          )
          .join("")
      : "<p class='text-muted'>No hay marcas</p>";
}
