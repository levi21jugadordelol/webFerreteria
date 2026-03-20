// filepondMarca.js
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = window.API_URL;
  const form = document.getElementById("formMarca");
  const inputImagen = document.getElementById("imagenMarca");

  if (!form) return;

  // 🔹 Cargar marcas existentes
  async function cargarMarcas() {
    const contenedor = document.getElementById("lista-marcas");
    if (!contenedor) return;

    try {
      const res = await fetch(`${apiUrl}/marcas`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al cargar marcas");

      const marcas = await res.json();

      contenedor.innerHTML =
        marcas.length > 0
          ? marcas
              .map(
                (m) => `
              <div class="card p-3 shadow-sm text-center" style="width:200px">
                <img src="${
                  m.url_logo
                    ? apiUrl + "/uploads/" + m.url_logo
                    : "https://via.placeholder.com/150"
                }" class="img-fluid rounded mb-2" />
                <h6 class="fw-bold">${m.nombre_marca}</h6>
                <p class="text-muted small">${m.descripcion || "Sin descripción"}</p>
              </div>`,
              )
              .join("")
          : "<p class='text-muted'>No hay marcas</p>";
    } catch (err) {
      console.error("❌ Error cargando marcas:", err);
    }
  }

  // 🔹 Inicializar FilePond
  const pond = FilePond.create(inputImagen, {
    allowMultiple: false,
    instantUpload: false,
    acceptedFileTypes: ["image/*"],
    labelIdle: "Arrastra o haz clic para seleccionar el logo de la marca",
  });

  // 🔹 Cargar marcas al iniciar
  cargarMarcas();

  // 🔹 Submit formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const marcaData = {
      nombre_marca: form.nombre_marca.value.trim(),
      descripcion: form.descripcion.value.trim(),
    };

    try {
      // 1️⃣ Crear marca
      const res = await fetch(`${apiUrl}/marcas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(marcaData),
      });

      // 🔥 Manejo seguro del JSON
      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(data.msg || `Error ${res.status}`);
      }

      const marcaId = data.marca?.id_marca || data.id_marca || data.marca?.id;

      if (!marcaId) {
        throw new Error("No se pudo obtener el ID de la marca");
      }

      // 2️⃣ Subir logo
      if (pond.getFiles().length > 0) {
        const archivo = pond.getFiles()[0].file;
        const formData = new FormData();
        formData.append("file", archivo);

        const imgRes = await fetch(`${apiUrl}/marcas/subir-logo/${marcaId}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        let imgData = {};
        try {
          imgData = await imgRes.json();
        } catch {}

        if (!imgRes.ok) {
          throw new Error(imgData.msg || "Error al subir logo");
        }
      }

      alert("✅ Marca creada correctamente");

      // 🔹 limpiar formulario
      form.reset();
      pond.removeFiles();

      // 🔹 recargar lista SIN redireccionar
      cargarMarcas();
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ " + err.message);
    }
  });
});
