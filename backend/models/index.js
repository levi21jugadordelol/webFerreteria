import Administrador from "./Administrador.js";
import Producto from "./Producto.js";
import Pedido from "./Pedido.js";
import DetallePedido from "./DetallePedido.js";
import ComprobantePago from "./Comprobante.js";
import Categoria from "./Categoria.js";
import Marca from "./Marca.js"; // 👈 NUEVO

// Administrador ↔ Producto
Administrador.hasMany(Producto, {
  foreignKey: "administrador_id",
  as: "productos",
});
Producto.belongsTo(Administrador, {
  foreignKey: "administrador_id",
  as: "administrador",
});

// Producto ↔ DetallePedido
Producto.hasMany(DetallePedido, { foreignKey: "producto_id", as: "detalles" });
DetallePedido.belongsTo(Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

// Pedido ↔ DetallePedido
Pedido.hasMany(DetallePedido, { foreignKey: "pedido_id", as: "detalles" });
DetallePedido.belongsTo(Pedido, { foreignKey: "pedido_id", as: "pedido" });

// Pedido ↔ ComprobantePago
Pedido.hasOne(ComprobantePago, { foreignKey: "pedido_id", as: "comprobante" });
ComprobantePago.belongsTo(Pedido, { foreignKey: "pedido_id", as: "pedido" });

// Categoria ↔ Producto
Categoria.hasMany(Producto, { foreignKey: "categoria_id", as: "productos" });
Producto.belongsTo(Categoria, { foreignKey: "categoria_id", as: "categoria" });

// ⭐ Marca ↔ Producto (nuevo)
Marca.hasMany(Producto, { foreignKey: "marca_id", as: "productos" });
Producto.belongsTo(Marca, { foreignKey: "marca_id", as: "marca" });

export {
  Administrador,
  Producto,
  Pedido,
  DetallePedido,
  ComprobantePago,
  Categoria,
  Marca, // 👈 exportar también
};
