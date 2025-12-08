// filepondCategoria.js
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = window.API_URL;
  const form = document.getElementById("formCategoria");
  const inputImagen = document.getElementById("imagenCategoria");

  // 🚨 Evita el error si no hay formulario
  if (!form) return;

  const pond = FilePond.create(inputImagen, {
    allowMultiple: false,
    instantUpload: false,
    acceptedFileTypes: ["image/*"],
    labelIdle:
      "Arrastra o haz clic para seleccionar una imagen de la categoría",
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const categoriaData = {
      nombre_categoria: form.nombre_categoria.value.trim(),
      descripcion: form.descripcion.value.trim(),
    };

    try {
      // 1️⃣ Crear la categoría
      const res = await fetch(`${apiUrl}/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoriaData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear categoría");

      const categoriaId =
        data.categoria?.id_categoria || data.id_categoria || data.categoria?.id;

      if (!categoriaId)
        throw new Error("No se pudo obtener el ID de la categoría creada");

      // 2️⃣ Subir imagen si existe
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
          }
        );

        const imgData = await imgRes.json();
        if (!imgRes.ok) throw new Error(imgData.msg || "Error al subir imagen");
      }

      alert("✅ Categoría guardada correctamente");
      window.location.href = "/admin/panel-categorias";
    } catch (err) {
      console.error("❌ Error al guardar categoría:", err);
      alert("❌ " + err.message);
    }
  });
});
