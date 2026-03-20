document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = window.API_URL;
  const form = document.getElementById("formCategoria");
  const inputImagen = document.getElementById("imagenCategoria");

  if (!form) return;

  // 🔹 Cargar categorías
  async function cargarCategorias() {
    const contenedor = document.getElementById("lista-categorias");
    if (!contenedor) return;

    try {
      const res = await fetch(`${apiUrl}/categorias`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al cargar categorías");

      const categorias = await res.json();

      contenedor.innerHTML =
        categorias.length > 0
          ? categorias
              .map(
                (c) => `
              <div class="card p-3 shadow-sm text-center" style="width:200px">
                <img src="${
                  c.url_imagen
                    ? apiUrl + "/uploads/" + c.url_imagen
                    : "https://via.placeholder.com/150"
                }" class="img-fluid rounded mb-2" />
                <h6 class="fw-bold">${c.nombre_categoria}</h6>
                <p class="text-muted small">${c.descripcion || "Sin descripción"}</p>
              </div>`,
              )
              .join("")
          : "<p class='text-muted'>No hay categorías</p>";
    } catch (err) {
      console.error("❌ Error:", err);
    }
  }

  // 🔹 FilePond
  const pond = FilePond.create(inputImagen, {
    allowMultiple: false,
    instantUpload: false,
    acceptedFileTypes: ["image/*"],
    labelIdle: "Arrastra o haz clic para seleccionar imagen",
  });

  cargarCategorias();

  // 🔹 Submit
  let enviando = false; // 🔥 CONTROL GLOBAL

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (enviando) return; // 🚫 BLOQUEA SEGUNDO SUBMIT
    enviando = true;

    const btn = form.querySelector("button");
    btn.disabled = true; // 🔒 desactiva botón

    const categoriaData = {
      nombre_categoria: form.nombre_categoria.value.trim(),
      descripcion: form.descripcion.value.trim(),
    };

    try {
      const res = await fetch(`${apiUrl}/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoriaData),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) throw new Error(data.msg || "Error al crear categoría");

      const categoriaId =
        data.categoria?.id_categoria || data.id_categoria || data.categoria?.id;

      if (!categoriaId) throw new Error("No se obtuvo ID");

      // subir imagen
      if (pond.getFiles().length > 0) {
        const archivo = pond.getFiles()[0].file;
        const formData = new FormData();
        formData.append("file", archivo);

        const imgRes = await fetch(
          `${apiUrl}/categorias/subir-imagen/${categoriaId}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!imgRes.ok) throw new Error("Error al subir imagen");
      }

      alert("✅ Categoría creada");

      form.reset();
      pond.removeFiles();
      cargarCategorias();
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ " + err.message);
    } finally {
      enviando = false; // 🔓 libera
      btn.disabled = false;
    }
  });
});
