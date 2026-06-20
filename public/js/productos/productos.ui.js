export function renderCategoriasSelect(select, categorias) {
  if (!select) return;

  select.replaceChildren();

  if (!Array.isArray(categorias) || categorias.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No hay categorías";

    select.appendChild(option);
    return;
  }

  categorias.forEach((c) => {
    const id = Number(c.id_categoria);

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    const option = document.createElement("option");
    option.value = String(id);
    option.textContent = c.nombre_categoria || "Sin nombre";

    select.appendChild(option);
  });
}

export function renderMarcasSelect(select, marcas) {
  if (!select) return;

  select.replaceChildren();

  if (!Array.isArray(marcas) || marcas.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No hay marcas";

    select.appendChild(option);
    return;
  }

  marcas.forEach((m) => {
    const id = Number(m.id_marca);

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    const option = document.createElement("option");
    option.value = String(id);
    option.textContent = m.nombre_marca || "Sin nombre";

    select.appendChild(option);
  });
}
