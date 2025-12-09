import express from "express";
import { body } from "express-validator";
import protegerRuta from "../middleware/protegerRuta.js";
import { upload } from "../middleware/upload.js";
import chalk from "chalk";

import {
  listarProductosPublicos,
  listarProductosAdmin,
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagen,
  subirImagenExtra,
  eliminarImagenExtra,
  agregarCaracteristica,
  eliminarCaracteristica,
  productosRelacionados,
} from "../controllers/productoController.js";

import { filtrarPorPrecio } from "../controllers/precioController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(chalk.bgBlue.white(`📥 [ROUTE] /productos${req.url}`));
  next();
});

/* --------------------
   🟢 Rutas públicas
-------------------- */
router.get("/precio", filtrarPorPrecio);
router.get("/:id/relacionados", productosRelacionados); // <--- primero
router.get("/", listarProductosPublicos);
router.get("/:id", obtenerProducto); // <--- después

/* --------------------
   🔒 Rutas admin
-------------------- */
router.get("/admin/lista", protegerRuta, listarProductosAdmin);

/* Crear Producto */
router.post(
  "/",
  protegerRuta,
  body("nombre_producto").notEmpty(),
  body("descripcion").notEmpty(),
  body("precio").isNumeric(),
  body("stock").isNumeric(),
  crearProducto
);

/* Actualizar */
router.put("/:id", protegerRuta, actualizarProducto);

/* Eliminar */
router.delete("/:id", protegerRuta, eliminarProducto);

/* Subir imagen principal */
router.post("/:id/imagen", protegerRuta, upload.single("file"), subirImagen);

/* Subir imagen adicional */
router.post(
  "/:id/imagenes",
  protegerRuta,
  upload.single("file"),
  subirImagenExtra
);

/* Eliminar imagen adicional */
router.delete("/:id/imagenes/:idImg", protegerRuta, eliminarImagenExtra);

/* Características */
router.post("/:id/caracteristicas", protegerRuta, agregarCaracteristica);
router.delete(
  "/:id/caracteristicas/:idCarac",
  protegerRuta,
  eliminarCaracteristica
);

export default router;
