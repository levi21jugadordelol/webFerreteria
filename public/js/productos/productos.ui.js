import { escapeHTML } from "../utils/helpers.js";

export function renderCategoriasSelect(select, categorias) {
  if (!select) return;

  select.innerHTML = categorias.length
    ? categorias
        .map(
          (c) =>
            `<option value="${c.id_categoria}">
              ${escapeHTML(c.nombre_categoria)}
            </option>`,
        )
        .join("")
    : `<option value="">No hay categorías</option>`;
}

export function renderMarcasSelect(select, marcas) {
  if (!select) return;

  select.innerHTML = marcas.length
    ? marcas
        .map(
          (m) =>
            `<option value="${m.id_marca}">
              ${escapeHTML(m.nombre_marca)}
            </option>`,
        )
        .join("")
    : `<option value="">No hay marcas</option>`;
}
