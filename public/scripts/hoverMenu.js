console.log("📌 hoverMenu.js cargado correctamente");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("📌 DOM listo");

  const wrapper = document.querySelector(".hover-menu-wrapper");
  const menu = wrapper.querySelector(".hover-menu-box");

  console.log("wrapper:", wrapper);
  console.log("menu:", menu);

  async function cargarCategorias() {
    try {
      console.log("📡 Consultando API...");

      const res = await fetch("/api/categorias");

      console.log("📡 Respuesta API:", res);

      const result = await res.json();

      const categorias = Array.isArray(result.data) ? result.data : [];

      console.log("📦 Categorías:", categorias);

      menu.replaceChildren();

      categorias.forEach((c) => {
        const id = Number(c.id_categoria);

        if (!Number.isInteger(id) || id <= 0) {
          return;
        }

        const link = document.createElement("a");

        link.href = `/productos?categoria=${encodeURIComponent(id)}`;

        link.textContent = c.nombre_categoria || "Sin nombre";

        menu.appendChild(link);
      });

      if (menu.children.length === 0) {
        const p = document.createElement("p");
        p.className = "loading";
        p.textContent = "No hay categorías";
        menu.appendChild(p);
      }

      console.log("📌 Categorías insertadas");
    } catch (err) {
      console.error("❌ Error API:", err);

      menu.replaceChildren();

      const p = document.createElement("p");
      p.className = "loading";
      p.textContent = "Error al cargar";

      menu.appendChild(p);
    }
  }

  cargarCategorias();

  let hideTimeout;

  wrapper.addEventListener("mouseenter", () => {
    console.log("🟢 mouseenter → mostrando menú");
    clearTimeout(hideTimeout);
    menu.classList.add("visible");
  });

  wrapper.addEventListener("mouseleave", () => {
    console.log("🟡 mouseleave → escondiendo menú");
    hideTimeout = setTimeout(() => {
      menu.classList.remove("visible");
    }, 200);
  });
});
