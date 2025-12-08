// 📦 CARRITO STORE — Manejador global del carrito (solo FRONTEND)
// Ubicación: /src/store/carritoStore.js

export const carritoStore = {
  // ================================
  // 🔍 Obtener carrito desde localStorage
  // ================================
  get() {
    try {
      const data = localStorage.getItem("carrito");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(
        "❌ carritoStore.get() — Error leyendo localStorage:",
        error
      );
      return [];
    }
  },

  // ================================
  // 💾 Guardar carrito y notificar
  // ================================
  save(carrito) {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));

      // 🔔 Notificar a todo el frontend
      document.dispatchEvent(new CustomEvent("carrito-actualizado"));
    } catch (error) {
      console.error("❌ carritoStore.save() — Error guardando carrito:", error);
    }
  },

  // ================================
  // ➕ Agregar producto
  // ================================
  add(producto) {
    if (!producto || !producto.id || !producto.nombre || !producto.precio) {
      console.warn("⚠ carritoStore.add() — Producto inválido:", producto);
      return;
    }

    const carrito = this.get();
    const existente = carrito.find((p) => p.id === producto.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        ...producto,
        cantidad: 1,
      });
    }

    this.save(carrito);
  },

  // ================================
  // 🔢 Obtener cantidad total de productos
  // ================================
  count() {
    return this.get().reduce((total, p) => total + p.cantidad, 0);
  },

  // ================================
  // ❌ Eliminar un producto
  // ================================
  remove(id) {
    const carrito = this.get().filter((p) => p.id !== id);
    this.save(carrito);
  },

  // ================================
  // 🧹 Vaciar carrito
  // ================================
  clear() {
    this.save([]);
  },
};

export default carritoStore;
