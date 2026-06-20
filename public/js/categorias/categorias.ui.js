import { getImageUrl } from "../utils/helpers.js";

function safeImageUrl(apiUrl, path) {
  const url = getImageUrl(apiUrl, path);

  if (!url || String(url).includes("..")) {
    return "/img/no-image.png";
  }

  return url;
}

export function renderCategorias(container, categorias, apiUrl) {
  container.replaceChildren();

  if (!Array.isArray(categorias) || categorias.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No hay categorías";
    container.appendChild(p);
    return;
  }

  categorias.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = safeImageUrl(apiUrl, c.url_imagen);
    img.alt = c.nombre_categoria || "Categoría";

    const title = document.createElement("h4");
    title.textContent = c.nombre_categoria || "Sin nombre";

    card.append(img, title);
    container.appendChild(card);
  });
}
