import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import uploadProducto from "../../shared/middleware/uploadProducto.js";
import { validateResult } from "../../shared/middleware/validateResult.js";

import {
  validarCrearProducto,
  validarIdProducto,
  validarSlug,
  validarCaracteristica,
  validarActualizarProducto,
} from "./producto.validator.js";

import {
  listarProductosPublicos,
  listarProductosAdmin,
  crearProducto,
  obtenerProducto,
  obtenerProductoAdmin,
  actualizarProducto,
  eliminarProducto,
  subirImagen,
  subirImagenExtra,
  eliminarImagenExtra,
  agregarCaracteristica,
  eliminarCaracteristica,
  productosRelacionados,
  listarProductosHome,
  actualizarCaracteristica,
  obtenerProductoCompleto,
  obtenerCaracteristicas,
} from "./producto.controller.js";

import { filtrarPorPrecio } from "../price/price.controller.js";

const router = express.Router();

/* --------------------
   🟢 PÚBLICAS
-------------------- */
router.get("/home", listarProductosHome);
router.get("/precio", filtrarPorPrecio);

router.get(
  "/:slug/relacionados",
  validarSlug,
  validateResult,
  productosRelacionados,
);
router.get("/:slug/full", validarSlug, validateResult, obtenerProductoCompleto);
router.get(
  "/:slug/caracteristicas",
  validarSlug,
  validateResult,
  obtenerCaracteristicas,
);

router.get("/", listarProductosPublicos);
router.get("/:slug", validarSlug, validateResult, obtenerProducto);

/* --------------------
   🔒 ADMIN
-------------------- */
router.use("/admin", protegerRuta);

/* LISTADO / DETALLE */
router.get("/admin/lista", listarProductosAdmin);

router.get(
  "/admin/:id",
  validarIdProducto,
  validateResult,
  obtenerProductoAdmin,
);

router.get(
  "/admin/:id/caracteristicas",
  validarIdProducto,
  validateResult,
  obtenerCaracteristicas,
);

/* CREAR */
router.post(
  "/admin",
  uploadProducto,
  validarCrearProducto,
  validateResult,
  crearProducto,
);

/* UPDATE / DELETE */
router.put(
  "/admin/:id",
  validarIdProducto,
  validarActualizarProducto,
  validateResult,
  actualizarProducto,
);
router.delete(
  "/admin/:id",
  validarIdProducto,
  validateResult,
  eliminarProducto,
);

/* IMÁGENES */
router.post(
  "/admin/:id/imagen",
  validarIdProducto,
  validateResult,
  uploadProducto,
  subirImagen,
);

router.post(
  "/admin/:id/imagenes",
  validarIdProducto,
  validateResult,
  uploadProducto,
  subirImagenExtra,
);

router.delete(
  "/admin/:id/imagenes/:idImg",
  validarIdProducto,
  validateResult,
  eliminarImagenExtra,
);

/* CARACTERÍSTICAS */
router.post(
  "/admin/:id/caracteristicas",
  validarIdProducto,
  validarCaracteristica,
  validateResult,
  agregarCaracteristica,
);

router.put(
  "/admin/:id/caracteristicas/:idCarac",
  validarCaracteristica,
  validateResult,
  actualizarCaracteristica,
);

router.delete(
  "/admin/:id/caracteristicas/:idCarac",
  validateResult,
  eliminarCaracteristica,
);

export default router;
