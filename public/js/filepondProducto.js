document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = window.API_URL;
  const form = document.getElementById("formProducto");
  const inputImagen = document.getElementById("imagen");

  if (!form || !inputImagen) return;

  // ✅ GUARDA la instancia
  const pond = FilePond.create(inputImagen, {
    allowMultiple: false,
    instantUpload: false,
    acceptedFileTypes: ["image/*"],
    labelIdle: "Arrastra o haz clic para seleccionar una imagen",
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // 🔥 LÍNEA CLAVE (AQUÍ ESTABA EL BUG)
    if (pond.getFiles().length > 0) {
      formData.set("imagen", pond.getFiles()[0].file);
    }

    console.log("📤 Enviando producto a /productos/admin");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await fetch(`${apiUrl}/productos/admin`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      console.log("📥 Respuesta backend:", data);

      if (!res.ok) {
        alert(data.msg || "Error al crear producto");
        return;
      }

      alert("✅ Producto creado correctamente");
      window.location.href = `/admin/productos/editar/${data.producto.id_producto}`;
    } catch (err) {
      console.error("❌ Error submit:", err);
      alert("Error de conexión");
    }
  });
});
