// routes/marcaRouter.js
import express from "express";
import { body } from "express-validator";
import protegerRuta from "../middleware/protegerRuta.js";
import uploadMarca from "../middleware/uploadMarca.js";

import {
  crearMarca,
  listarMarcas,
  obtenerMarca,
  actualizarMarca,
  eliminarMarca,
  subirLogoMarca,
} from "../controllers/marcaController.js";

const router = express.Router();

// 🟢 Públicas
router.get("/", listarMarcas);
router.get("/:id", obtenerMarca);

// 🔒 Protegidas
router.post(
  "/",
  protegerRuta,
  body("nombre_marca")
    .notEmpty()
    .withMessage("El nombre de la marca es obligatorio"),
  crearMarca
);

router.put("/:id", protegerRuta, actualizarMarca);
router.delete("/:id", protegerRuta, eliminarMarca);

// 🖼️ Subida de logo
router.post(
  "/subir-logo/:id",
  protegerRuta,
  uploadMarca.single("file"), // ✅ CORRECTO
  subirLogoMarca
);

export default router;
