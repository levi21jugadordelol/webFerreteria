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
} from "../controllers/productoController.js";

import { filtrarPorPrecio } from "../controllers/precioController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(chalk.bgBlue.white(`📥 [ROUTE] /productos${req.url}`));
  console.log("🟠 ROUTER RECIBIÓ QUERY:", req.query);
  console.log("🟠 ROUTER RECIBIÓ URL:", req.originalUrl);
  next();
});

/* 
───────────────────────────────────────
 🟢 Rutas públicas (sin login)
───────────────────────────────────────
*/

// ⚠️ ESTA RUTA **SIEMPRE ANTES** de /:id
router.get("/precio", filtrarPorPrecio);

router.get("/", listarProductosPublicos);
router.get("/:id", obtenerProducto);

/* 
───────────────────────────────
 🔒 Rutas protegidas (solo admin)
───────────────────────────────
*/
router.get("/admin/lista", protegerRuta, listarProductosAdmin);

// ➕ Crear producto
router.post(
  "/",
  protegerRuta,
  body("nombre_producto")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
  body("precio").isNumeric().withMessage("El precio debe ser numérico"),
  body("stock").isNumeric().withMessage("El stock debe ser numérico"),
  crearProducto
);

// ✏️ Actualizar producto
router.put("/:id", protegerRuta, actualizarProducto);

// 🗑️ Eliminar producto
router.delete("/:id", protegerRuta, eliminarProducto);

// 🖼️ Subir imagen
router.post("/:id/imagen", protegerRuta, upload.single("file"), subirImagen);

export default router;
