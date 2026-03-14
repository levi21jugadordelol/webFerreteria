import Administrador from "../src/modules/admin/admin.model.js";
import Producto from "./Producto.js";
import Pedido from "./Pedido.js";
import DetallePedido from "./DetallePedido.js";
import ComprobantePago from "./Comprobante.js";
import Categoria from "../src/modules/categories/category.model.js";

import Marca from "../src/modules/brands/marca.model.js";
import ProductoCaracteristica from "./ProductoCaracteristica.js"; // 🆕
import ProductoImagen from "./ProductoImagen.js"; // 🆕
import ProductoTab from "./ProductoTab.js";

/* ──────────────────────────────
   ADMINISTRADOR ↔ PRODUCTO
────────────────────────────── */
Administrador.hasMany(Producto, {
  foreignKey: "administrador_id",
  as: "productos",
});
Producto.belongsTo(Administrador, {
  foreignKey: "administrador_id",
  as: "administrador",
});

/* ──────────────────────────────
   PRODUCTO ↔ DETALLE PEDIDO
────────────────────────────── */
Producto.hasMany(DetallePedido, {
  foreignKey: "producto_id",
  as: "detalles",
});
DetallePedido.belongsTo(Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

/* ──────────────────────────────
   PEDIDO ↔ DETALLE PEDIDO
────────────────────────────── */
Pedido.hasMany(DetallePedido, {
  foreignKey: "pedido_id",
  as: "detalles",
});
DetallePedido.belongsTo(Pedido, {
  foreignKey: "pedido_id",
  as: "pedido",
});

/* ──────────────────────────────
   PEDIDO ↔ COMPROBANTE
────────────────────────────── */
Pedido.hasOne(ComprobantePago, {
  foreignKey: "pedido_id",
  as: "comprobante",
});
ComprobantePago.belongsTo(Pedido, {
  foreignKey: "pedido_id",
  as: "pedido",
});

/* ──────────────────────────────
   CATEGORIA ↔ PRODUCTO
────────────────────────────── */
Categoria.hasMany(Producto, {
  foreignKey: "categoria_id",
  as: "productos",
});
Producto.belongsTo(Categoria, {
  foreignKey: "categoria_id",
  as: "categoria",
});

/* ──────────────────────────────
   MARCA ↔ PRODUCTO
────────────────────────────── */
Marca.hasMany(Producto, {
  foreignKey: "marca_id",
  as: "productos",
});
Producto.belongsTo(Marca, {
  foreignKey: "marca_id",
  as: "marca",
});

/* ──────────────────────────────
   PRODUCTO ↔ CARACTERÍSTICAS
────────────────────────────── */
Producto.hasMany(ProductoCaracteristica, {
  foreignKey: "producto_id",
  as: "caracteristicas",
});
ProductoCaracteristica.belongsTo(Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

/* ──────────────────────────────
   PRODUCTO ↔ IMÁGENES
────────────────────────────── */
Producto.hasMany(ProductoImagen, {
  foreignKey: "producto_id",
  as: "imagenes",
});
ProductoImagen.belongsTo(Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

/* ──────────────────────────────
   TAB ↔ CARACTERÍSTICAS
────────────────────────────── */

ProductoTab.hasMany(ProductoCaracteristica, {
  foreignKey: "tab_id",
  as: "caracteristicas",
});

ProductoCaracteristica.belongsTo(ProductoTab, {
  foreignKey: "tab_id",
  as: "tab",
});

/* ──────────────────────────────
   EXPORTAR TODO
────────────────────────────── */
export {
  Administrador,
  Producto,
  Pedido,
  DetallePedido,
  ComprobantePago,
  Categoria,
  Marca,
  ProductoCaracteristica,
  ProductoImagen,
  ProductoTab,
};
