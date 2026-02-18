import express from "express";
import { body } from "express-validator";
import protegerRuta from "../middleware/protegerRuta.js";
import uploadCategoria from "../middleware/uploadCategoria.js";

import {
  crearCategoria,
  listarCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
  subirImagenCategoria,
} from "../controllers/categoriaController.js";

const router = express.Router();

// 🟢 Públicas
router.get("/", listarCategorias);
router.get("/:id", obtenerCategoria);

// 🔒 Protegidas
router.post(
  "/",
  protegerRuta,
  uploadCategoria.single("file"), // 🔥 OBLIGATORIO
  body("nombre_categoria")
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio"),
  crearCategoria,
);

router.put("/:id", protegerRuta, actualizarCategoria);
router.delete("/:id", protegerRuta, eliminarCategoria);

// 🖼️ Subida de imagen
router.post(
  "/subir-imagen/:id",
  protegerRuta,
  uploadCategoria.single("file"), // ✅ CORRECTO
  subirImagenCategoria,
);

export default router;
