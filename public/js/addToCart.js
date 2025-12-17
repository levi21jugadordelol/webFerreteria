import carritoStore from "/src/store/carritoStore.js";

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  const card = btn.closest("[data-producto]");
  if (!card) return;

  const producto = {
    id: Number(card.dataset.id),
    nombre: card.dataset.nombre,
    precio: Number(card.dataset.precio),
    imagen: card.dataset.imagen,
  };

  carritoStore.add(producto);
});
