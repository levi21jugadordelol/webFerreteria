import { getImageUrl } from "../utils/helpers.js";

function safeImageUrl(apiUrl, path) {
  const url = getImageUrl(apiUrl, path);

  if (!url || String(url).includes("..")) {
    return "/img/no-image.png";
  }

  return url;
}

export function renderMarcas(container, marcas, apiUrl) {
  if (!container) return;

  container.replaceChildren();

  if (!Array.isArray(marcas) || marcas.length === 0) {
    const p = document.createElement("p");
    p.className = "text-muted";
    p.textContent = "No hay marcas";
    container.appendChild(p);
    return;
  }

  marcas.forEach((m) => {
    const card = document.createElement("div");
    card.className = "card p-3 shadow-sm text-center";
    card.style.width = "200px";

    const img = document.createElement("img");
    img.src = safeImageUrl(apiUrl, m.url_logo);
    img.alt = m.nombre_marca || "Marca";
    img.className = "img-fluid rounded mb-2";

    const titulo = document.createElement("h6");
    titulo.className = "fw-bold";
    titulo.textContent = m.nombre_marca || "Sin nombre";

    const descripcion = document.createElement("p");
    descripcion.className = "text-muted small";
    descripcion.textContent = m.descripcion || "Sin descripción";

    card.append(img, titulo, descripcion);

    container.appendChild(card);
  });
}
