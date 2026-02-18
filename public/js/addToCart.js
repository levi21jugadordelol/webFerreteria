import carritoStore from "/src/store/carritoStore.js";

async function getStock(id) {
  try {
    const res = await fetch(`http://localhost:3000/productos/${id}`);
    const data = await res.json();
    return data.stock ?? 0;
  } catch (err) {
    console.error("❌ Error obteniendo stock:", err);
    return 0;
  }
}

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

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;

  if (btn.disabled) return;

  const card = btn.closest("[data-producto]");
  if (!card) return;

  const id = Number(card.dataset.id);

  // 🔥 Obtener stock real del backend
  const stock = await getStock(id);

  // 🔥 Obtener carrito actual
  const carrito = carritoStore.get();
  const item = carrito.find((p) => p.id === id);
  const cantidadActual = item ? item.cantidad : 0;

  // 🔥 Validar contra stock real
  if (cantidadActual + 1 > stock) {
    showCardMessage(card, `Solo quedan ${stock} unidades`);

    btn.disabled = true;
    btn.textContent = "Sin stock";

    const imgBox = card.querySelector(".card-img");
    imgBox.style.position = "relative";

    if (!card.querySelector(".badge-agotado")) {
      const badge = document.createElement("span");
      badge.className = "badge-agotado";
      badge.textContent = "AGOTADO";
      imgBox.appendChild(badge);
    }

    return;
  }

  // ✅ Agregar normalmente
  const producto = {
    id: id,
    nombre: card.dataset.nombre,
    precio: Number(card.dataset.precio),
    imagen: card.dataset.imagen,
    cantidad: 1,
  };

  carritoStore.add(producto);
});
