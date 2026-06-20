import ProductoService from "./producto.service.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import logger from "../../shared/logger/logger.js";

/* -----------------------------
   Crear Producto
----------------------------- */
export const crearProducto = asyncHandler(async (req, res) => {
  const producto = await ProductoService.crearProducto(
    req.body,
    req.file,
    req.admin,
  );

  logger.info({
    message: "Product created",
    productId: producto.id_producto,
    adminId: req.admin?.id_administrador,
  });

  return res.success({
    status: 201,
    message: "Producto creado correctamente",
    data: producto,
  });
});

/* -----------------------------
   Subir imagen principal
----------------------------- */
export const subirImagen = asyncHandler(async (req, res) => {
  const url = await ProductoService.subirImagen(req.params.id, req.file);

  logger.info({
    message: "Product main image updated",
    productId: Number(req.params.id),
    hasFile: Boolean(req.file),
  });

  return res.success({
    message: "Imagen actualizada",
    data: { url_imagen: url },
  });
});

/* -----------------------------
   Subir imagen adicional
----------------------------- */
export const subirImagenExtra = asyncHandler(async (req, res) => {
  const imagen = await ProductoService.subirImagenExtra(
    req.params.id,
    req.file,
  );

  logger.info({
    message: "Product extra image uploaded",
    productId: Number(req.params.id),
    imageId: imagen.id_imagen ?? imagen.id_producto_imagen ?? null,
    hasFile: Boolean(req.file),
  });

  return res.success({
    message: "Imagen guardada",
    data: imagen,
  });
});

/* -----------------------------
   Eliminar imagen extra
----------------------------- */
export const eliminarImagenExtra = asyncHandler(async (req, res) => {
  await ProductoService.eliminarImagenExtra(req.params.idImg);

  logger.info({
    message: "Product extra image deleted",
    imageId: Number(req.params.idImg),
  });

  return res.success({
    message: "Imagen eliminada",
  });
});

/* -----------------------------
   Agregar característica
----------------------------- */
export const agregarCaracteristica = asyncHandler(async (req, res) => {
  const result = await ProductoService.agregarCaracteristica(
    req.params.id,
    req.body,
  );

  logger.info({
    message: "Product feature added",
    productId: Number(req.params.id),
    featureId: result.id_caracteristica ?? null,
  });

  return res.success({
    message: "Característica agregada",
    data: result,
  });
});

/* -----------------------------
   Editar característica
----------------------------- */
export const actualizarCaracteristica = asyncHandler(async (req, res) => {
  await ProductoService.actualizarCaracteristica(req.params.idCarac, req.body);

  logger.info({
    message: "Product feature updated",
    featureId: Number(req.params.idCarac),
  });

  return res.success({
    message: "Característica actualizada",
  });
});

/* -----------------------------
   Eliminar característica
----------------------------- */
export const eliminarCaracteristica = asyncHandler(async (req, res) => {
  await ProductoService.eliminarCaracteristica(req.params.idCarac);

  logger.info({
    message: "Product feature deleted",
    featureId: Number(req.params.idCarac),
  });

  return res.success({
    message: "Característica eliminada",
  });
});

/* -----------------------------
   Listar productos públicos
----------------------------- */
export const listarProductosPublicos = asyncHandler(async (req, res) => {
  const productos = await ProductoService.listarPublicos(req.query);

  return res.success({
    data: productos,
  });
});

/* -----------------------------
   Obtener producto
----------------------------- */
export const obtenerProducto = asyncHandler(async (req, res) => {
  const producto = await ProductoService.obtenerPorSlug(req.params.slug);

  return res.success({
    data: producto,
  });
});

/* -----------------------------
   Productos relacionados
----------------------------- */
export const productosRelacionados = asyncHandler(async (req, res) => {
  const data = await ProductoService.productosRelacionados(req.params.slug);

  return res.success({
    data,
  });
});

/* -----------------------------
   Listar admin
----------------------------- */
export const listarProductosAdmin = asyncHandler(async (req, res) => {
  const productos = await ProductoService.listarAdmin();

  return res.success({
    data: productos,
  });
});

/* -----------------------------
   Actualizar
----------------------------- */
export const actualizarProducto = asyncHandler(async (req, res) => {
  const producto = await ProductoService.actualizarProducto(
    req.params.id,
    req.body,
  );

  logger.info({
    message: "Product updated",
    productId: producto.id_producto,
    adminId: req.admin?.id_administrador,
  });

  return res.success({
    message: "Producto actualizado",
    data: producto,
  });
});

/* -----------------------------
   Eliminar
----------------------------- */
export const eliminarProducto = asyncHandler(async (req, res) => {
  await ProductoService.eliminarProducto(req.params.id);

  logger.info({
    message: "Product deleted",
    productId: Number(req.params.id),
    adminId: req.admin?.id_administrador,
  });

  return res.success({
    message: "Producto eliminado",
  });
});

/* -----------------------------
   Productos HOME
----------------------------- */
export const listarProductosHome = asyncHandler(async (req, res) => {
  const { tipo, limit } = req.query;

  const productos = await ProductoService.listarHome({ tipo, limit });

  return res.success({
    data: productos,
  });
});

/* -----------------------------
   Obtener producto completo
----------------------------- */
export const obtenerProductoCompleto = asyncHandler(async (req, res) => {
  const data = await ProductoService.obtenerProductoCompleto(req.params.slug);

  return res.success({
    data,
  });
});

/* -----------------------------
   Obtener características
----------------------------- */
export const obtenerCaracteristicas = asyncHandler(async (req, res) => {
  const data = await ProductoService.obtenerCaracteristicas(req.params.id);

  return res.success({
    data,
  });
});

/* -----------------------------
   Obtener producto admin
----------------------------- */
export const obtenerProductoAdmin = asyncHandler(async (req, res) => {
  const producto = await ProductoService.obtenerPorId(req.params.id);

  return res.success({
    data: producto,
  });
});
