import carritoStore from "/src/store/carritoStore.js";

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  // ⛔ Bloqueo por HTML (extra seguridad)
  if (btn.disabled) {
    console.warn("⚠️ Producto agotado (botón deshabilitado)");
    return;
  }

  const card = btn.closest("[data-producto]");
  if (!card) return;

  // 🔥 Validación explícita por data-attribute
  const agotado = card.dataset.agotado === "true";

  if (agotado) {
    console.warn("⛔ Intento de agregar producto agotado");
    return;
  }

  const producto = {
    id: Number(card.dataset.id),
    nombre: card.dataset.nombre,
    precio: Number(card.dataset.precio),
    imagen: card.dataset.imagen,
    cantidad: 1,
  };

  carritoStore.add(producto);
});
