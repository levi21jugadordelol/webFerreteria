document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn || btn.disabled) return;

  const card = btn.closest("[data-producto]");
  if (!card) return;

  const id = Number(card.dataset.id);
  const stock = Number(card.dataset.stock);
  const precio = Number(card.dataset.precio);

  if (!id || isNaN(stock) || isNaN(precio)) return;

  let carrito = carritoStore.get();
  const item = carrito.find((p) => p.id === id);
  const cantidadActual = item ? item.cantidad : 0;

  if (cantidadActual >= stock) {
    showCardMessage(card, `Solo quedan ${stock} unidades`);
    marcarAgotado(card, btn);
    return;
  }

  carritoStore.add({
    id,
    nombre: card.dataset.nombre,
    precio,
    imagen: card.dataset.imagen,
    cantidad: 1,
  });

  carrito = carritoStore.get();
  const nuevoItem = carrito.find((p) => p.id === id);

  if (nuevoItem && nuevoItem.cantidad >= stock) {
    marcarAgotado(card, btn);
  }
});
