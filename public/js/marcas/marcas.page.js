import { getApiUrl } from "../utils/helpers.js";
import {
  obtenerMarcas,
  crearMarca,
  subirLogoMarca,
} from "../marcas/marcas.api.js";
import { renderMarcas } from "../marcas/marcas.ui.js";
import { showToast } from "../utils/toast.js";

console.log("🔥 marcas.page.js cargado");

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = getApiUrl();

  const form = document.getElementById("formMarca");
  const inputImagen = document.getElementById("imagenMarca");
  const contenedor = document.getElementById("lista-marcas");

  let enviando = false;

  /* ===============================
     Cargar marcas SIEMPRE
  ================================= */
  async function cargarMarcasUI() {
    if (!contenedor) return;

    try {
      const marcas = await obtenerMarcas(apiUrl);
      renderMarcas(contenedor, marcas, apiUrl);
    } catch (error) {
      showToast("Error al cargar marcas", "error");
    }
  }

  // 🔥 siempre cargar marcas
  cargarMarcasUI();

  /* ===============================
     FORMULARIO (solo si existe)
  ================================= */
  if (form && inputImagen) {
    const pond = FilePond.create(inputImagen, {
      allowMultiple: false,
      instantUpload: false,
      storeAsFile: true, // 🔥 IMPORTANTE AQUÍ
      acceptedFileTypes: ["image/*"],
      labelIdle: "Arrastra o haz clic para seleccionar el logo",
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      console.log("🟡 [1] Submit iniciado");

      if (enviando) {
        console.log("⚠️ Ya se está enviando");
        return;
      }

      enviando = true;

      const btn = form.querySelector("button");
      btn.disabled = true;

      const nombre = form.nombre_marca.value.trim();
      const descripcion = form.descripcion.value.trim();

      console.log("🟡 [2] Datos capturados:", {
        nombre_marca: nombre,
        descripcion,
      });

      try {
        console.log("🟡 [3] Enviando a crearMarca...");

        const data = await crearMarca(apiUrl, {
          nombre_marca: nombre,
          descripcion,
        });

        console.log("🟢 [4] Respuesta crearMarca:", data);

        const marcaId = data.marca?.id_marca || data.id_marca || data.marca?.id;

        console.log("🟡 [5] ID obtenido:", marcaId);

        if (!marcaId) throw new Error("No se obtuvo ID");

        console.log("🟡 [6] Revisando archivos en FilePond...");
        console.log("FILES:", pond.getFiles());

        if (pond.getFiles().length > 0) {
          const archivo = pond.getFiles()[0].file;

          console.log("🟢 [7] Archivo encontrado:", archivo);

          console.log("🟡 [8] Subiendo logo...");

          const resLogo = await subirLogoMarca(apiUrl, marcaId, archivo);

          console.log("🟢 [9] Logo subido:", resLogo);
        } else {
          console.log("⚠️ [7] No hay archivo en FilePond");
        }

        console.log("🟢 [10] Proceso completado correctamente");

        showToast("Marca creada correctamente", "success");

        form.reset();
        pond.removeFiles();

        await cargarMarcasUI();
      } catch (error) {
        console.log("🔴 [ERROR]:", error);
        showToast(error.message, "error");
      } finally {
        console.log("🟡 [FIN] Liberando botón");

        enviando = false;
        btn.disabled = false;
      }
    });
  }
});
