document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = window.API_URL;

  const form = document.getElementById("formProducto");
  const inputImagen = document.getElementById("imagen");

  if (!form || !inputImagen) return;

  /* =========================
     FILEPOND
  ========================= */
  const pond = FilePond.create(inputImagen);

  /* =========================
     🔥 LLAMADAS AQUÍ
  ========================= */
  cargarCategorias();
  cargarMarcas();

  /* =========================
     SUBMIT
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    if (pond.getFiles().length > 0) {
      formData.set("imagen", pond.getFiles()[0].file);
    }

    try {
      const res = await fetch(`${apiUrl}/productos/admin`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error");
        return;
      }

      window.location.href = `/admin/productos/editar/${data.producto.id_producto}`;
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  });
});

async function cargarCategorias() {
  const select = document.getElementById("categoriaSelect");
  if (!select) return;

  try {
    const res = await fetch(`${window.API_URL}/categorias`, {
      credentials: "include",
    });

    const data = await res.json();

    select.innerHTML = data.length
      ? data
          .map(
            (c) =>
              `<option value="${c.id_categoria}">${c.nombre_categoria}</option>`,
          )
          .join("")
      : `<option value="">No hay categorías</option>`;
  } catch (err) {
    console.error("Error cargando categorías", err);
    select.innerHTML = `<option value="">Error al cargar</option>`;
  }
}

async function cargarMarcas() {
  const select = document.getElementById("marcaSelect");
  if (!select) return;

  try {
    const res = await fetch(`${window.API_URL}/marcas`, {
      credentials: "include",
    });

    const data = await res.json();

    select.innerHTML = data.length
      ? data
          .map(
            (m) => `<option value="${m.id_marca}">${m.nombre_marca}</option>`,
          )
          .join("")
      : `<option value="">No hay marcas</option>`;
  } catch (err) {
    console.error("Error cargando marcas", err);
    select.innerHTML = `<option value="">Error al cargar</option>`;
  }
}
