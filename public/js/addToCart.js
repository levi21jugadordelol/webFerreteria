// /src/js/addToCart.js
import carritoStore from "/src/store/carritoStore.js";

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  const card = btn.closest("[data-producto]");
  if (!card) {
    console.warn("❌ No se encontró data-producto");
    return;
  }

  const producto = {
    id: card.dataset.id,
    nombre: card.dataset.nombre,
    precio: Number(card.dataset.precio),
    imagen: card.dataset.imagen,
  };

  console.log("✔ Producto agregado:", producto);

  carritoStore.add(producto);

  // 👀 AQUÍ VES EL CARRITO EN LA CONSOLA
  console.log("🛒 Carrito ahora:", carritoStore.get());
});
