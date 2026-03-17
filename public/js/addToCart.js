import carritoStore from "/src/store/carritoStore.js";

/* ===============================
   Mostrar mensaje en tarjeta
================================= */
function showCardMessage(card, message) {
  let msg = card.querySelector(".card-msg");

  if (!msg) {
    msg = document.createElement("div");
    msg.className = "card-msg";
    card.appendChild(msg);
  }

  msg.textContent = message;

  setTimeout(() => {
    msg.remove();
  }, 2500);
}

/* ===============================
   Marcar producto como agotado
================================= */
function marcarAgotado(card, btn) {
  btn.disabled = true;
  btn.textContent = "Sin stock";

  const imgBox = card.querySelector(".card-img");

  if (imgBox) {
    imgBox.style.position = "relative";

    if (!card.querySelector(".badge-agotado")) {
      const badge = document.createElement("span");
      badge.className = "badge-agotado";
      badge.textContent = "AGOTADO";
      imgBox.appendChild(badge);
    }
  }
}

/* ===============================
   Click global agregar carrito
================================= */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  if (btn.disabled) return;

  const card = btn.closest("[data-producto]");
  if (!card) return;

  const id = Number(card.dataset.id);
  const stock = Number(card.dataset.stock);

  if (!id || isNaN(stock)) {
    console.warn("⚠ Producto inválido en tarjeta");
    return;
  }

  /* ===============================
     Obtener carrito actual
  ================================= */
  const carrito = carritoStore.get();
  const item = carrito.find((p) => p.id === id);
  const cantidadActual = item ? item.cantidad : 0;

  /* ===============================
     Validar stock disponible
  ================================= */
  if (cantidadActual >= stock) {
    showCardMessage(card, `Solo quedan ${stock} unidades`);
    marcarAgotado(card, btn);
    return;
  }

  /* ===============================
     Agregar producto al carrito
  ================================= */
  const producto = {
    id: id,
    nombre: card.dataset.nombre,
    precio: Number(card.dataset.precio),
    imagen: card.dataset.imagen,
    cantidad: 1,
  };

  carritoStore.add(producto);

  /* ===============================
     Verificar si ahora se agotó
  ================================= */
  const nuevoCarrito = carritoStore.get();
  const nuevoItem = nuevoCarrito.find((p) => p.id === id);

  if (nuevoItem && nuevoItem.cantidad >= stock) {
    marcarAgotado(card, btn);
  }
});
