document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = window.API_URL;
  const form = document.getElementById("formProducto");
  const inputImagen = document.getElementById("imagen");

  // ✅ Inicializar FilePond
  const pond = FilePond.create(inputImagen, {
    allowMultiple: false,
    instantUpload: false, // Subir sólo cuando el producto esté creado
    acceptedFileTypes: ["image/*"],
    labelIdle: "Arrastra o haz clic para seleccionar una imagen del producto",
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productoData = {
      nombre_producto: form.nombre_producto.value.trim(),
      descripcion: form.descripcion.value.trim(),
      precio: parseFloat(form.precio.value),
      stock: parseInt(form.stock.value, 10),

      // 🔹 NUEVO:
      categoria_id: parseInt(form.categoria_id.value, 10),
      marca_id: parseInt(form.marca_id.value, 10),
    };

    try {
      // 1️⃣ Crear el producto
      const res = await fetch(`${apiUrl}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData),
        credentials: "include", // por si usas login
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al guardar producto");

      // Obtén el ID del producto (puede ser 'id' o 'id_producto')
      const productoId =
        data.producto?.id_producto || data.id_producto || data.producto?.id;

      if (!productoId)
        throw new Error("No se pudo obtener el ID del producto creado");

      // 2️⃣ Subir imagen si existe
      if (pond.getFiles().length > 0) {
        const archivo = pond.getFiles()[0].file;
        const formData = new FormData();
        formData.append("file", archivo); // 🔹 nombre correcto que espera multer

        const imgRes = await fetch(`${apiUrl}/productos/${productoId}/imagen`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const imgData = await imgRes.json();
        if (!imgRes.ok) throw new Error(imgData.msg || "Error al subir imagen");
      }

      alert("✅ Producto guardado correctamente");
      window.location.href = "/admin/panel-admin";
    } catch (err) {
      console.error("❌ Error al guardar producto:", err);
      alert("❌ " + err.message);
    }
  });
});
