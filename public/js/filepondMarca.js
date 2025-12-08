// filepondMarca.js
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = window.API_URL;
  const form = document.getElementById("formMarca");
  const inputImagen = document.getElementById("imagenMarca");

  if (!form) return; // evitar errores

  const pond = FilePond.create(inputImagen, {
    allowMultiple: false,
    instantUpload: false,
    acceptedFileTypes: ["image/*"],
    labelIdle: "Arrastra o haz clic para seleccionar el logo de la marca",
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const marcaData = {
      nombre_marca: form.nombre_marca.value.trim(),
      descripcion: form.descripcion.value.trim(),
    };

    try {
      // 1️⃣ Crear marca SIN imagen
      const res = await fetch(`${apiUrl}/marcas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(marcaData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al crear marca");

      const marcaId = data.marca?.id_marca || data.id_marca || data.marca?.id;

      if (!marcaId)
        throw new Error("No se pudo obtener el ID de la marca creada");

      // 2️⃣ Subir imagen (logo)
      if (pond.getFiles().length > 0) {
        const archivo = pond.getFiles()[0].file;
        const formData = new FormData();
        formData.append("file", archivo);

        const imgRes = await fetch(`${apiUrl}/marcas/subir-logo/${marcaId}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const imgData = await imgRes.json();
        if (!imgRes.ok) throw new Error(imgData.msg || "Error al subir logo");
      }

      alert("✅ Marca creada correctamente");
      window.location.href = "/admin/marcas/marca-lista";
    } catch (err) {
      console.error("❌ Error al guardar marca:", err);
      alert("❌ " + err.message);
    }
  });
});
