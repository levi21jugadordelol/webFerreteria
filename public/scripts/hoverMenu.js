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

      const res = await fetch("http://localhost:3000/categorias");
      console.log("📡 Respuesta API:", res);

      const categorias = await res.json();
      console.log("📦 Categorías:", categorias);

      menu.innerHTML = categorias
        .map(
          (c) =>
            `<a href="/categorias/${c.id_categoria}">${c.nombre_categoria}</a>`
        )
        .join("");

      console.log("📌 Categorías insertadas");
    } catch (err) {
      console.error("❌ Error API:", err);
      menu.innerHTML = `<p class="loading">Error al cargar</p>`;
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
