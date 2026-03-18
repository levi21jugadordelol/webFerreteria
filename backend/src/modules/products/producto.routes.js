import express from "express";
import { body } from "express-validator";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import uploadProducto from "../../shared/middleware/uploadProducto.js";

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

router.get("/:slug/relacionados", productosRelacionados);
router.get("/:slug/full", obtenerProductoCompleto);
router.get("/:slug/caracteristicas", obtenerCaracteristicas);

router.get("/", listarProductosPublicos);
router.get("/:slug", obtenerProducto);

/* --------------------
   🔒 ADMIN
-------------------- */
router.use("/admin", protegerRuta);

router.get("/admin/lista", listarProductosAdmin);
router.get("/admin/:id", obtenerProductoAdmin);
router.get("/admin/:id/caracteristicas", obtenerCaracteristicas);

router.post(
  "/admin",
  uploadProducto.single("imagen"),
  body("nombre_producto").notEmpty(),
  body("descripcion").optional(),
  body("precio").isNumeric(),
  body("stock").isNumeric(),
  crearProducto,
);

router.put("/admin/:id", actualizarProducto);
router.delete("/admin/:id", eliminarProducto);

/* Imágenes */
router.post("/admin/:id/imagen", uploadProducto.single("imagen"), subirImagen);

router.post(
  "/admin/:id/imagenes",
  uploadProducto.single("imagen"),
  subirImagenExtra,
);

router.delete("/admin/:id/imagenes/:idImg", eliminarImagenExtra);

/* Características */
router.post("/admin/:id/caracteristicas", agregarCaracteristica);
router.put("/admin/:id/caracteristicas/:idCarac", actualizarCaracteristica);
router.delete("/admin/:id/caracteristicas/:idCarac", eliminarCaracteristica);

export default router;
