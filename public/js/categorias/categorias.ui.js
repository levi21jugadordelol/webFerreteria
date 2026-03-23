import { getImageUrl } from "../utils/helpers.js";

export function renderCategorias(container, categorias, apiUrl) {
  container.innerHTML = categorias
    .map(
      (c) => `
      <div class="card">
        <img src="${getImageUrl(apiUrl, c.url_imagen)}" />
        <h4>${c.nombre_categoria}</h4>
      </div>
    `,
    )
    .join("");
}
