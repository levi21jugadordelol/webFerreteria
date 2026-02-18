import express from "express";
import { body } from "express-validator";
import protegerRuta from "../middleware/protegerRuta.js";
import uploadProducto from "../middleware/uploadProducto.js";
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
  listarProductosHome,
  actualizarCaracteristica,
} from "../controllers/productoController.js";

import { filtrarPorPrecio } from "../controllers/precioController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(chalk.bgBlue.white(`📥 [ROUTE] /productos${req.url}`));
  next();
});

/* --------------------
   🟢 PÚBLICAS
-------------------- */
router.get("/home", listarProductosHome);
router.get("/precio", filtrarPorPrecio);
router.get("/:id/relacionados", productosRelacionados);
router.get("/", listarProductosPublicos);
router.get("/:id", obtenerProducto);

/* --------------------
   🔒 ADMIN
-------------------- */
router.use("/admin", protegerRuta);

router.get("/admin/lista", listarProductosAdmin);

router.post(
  "/admin",
  uploadProducto.single("imagen"),
  body("nombre_producto").notEmpty(),
  body("descripcion").optional(), // 👈 AQUÍ
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
