import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import uploadCategoria from "../../shared/middleware/uploadCategoria.js";

import {
  crearCategoria,
  listarCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
  subirImagenCategoria,
} from "./category.controller.js";

import {
  validarCrearCategoria,
  validarActualizarCategoria,
  validarId,
} from "./category.validator.js";

import { validateResult } from "../../shared/middleware/validateResult.js";

const router = express.Router();

/* =========================
   🟢 Públicas
========================= */
router.get("/", listarCategorias);

router.get("/:id", validarId, validateResult, obtenerCategoria);

/* =========================
   🔒 Protegidas
========================= */
router.post(
  "/",
  protegerRuta,
  validarCrearCategoria,
  validateResult,
  crearCategoria,
);

router.put(
  "/:id",
  protegerRuta,
  validarId,
  validarActualizarCategoria,
  validateResult,
  actualizarCategoria,
);

router.delete(
  "/:id",
  protegerRuta,
  validarId,
  validateResult,
  eliminarCategoria,
);

/* =========================
   🖼️ Subida de imagen
========================= */
router.post(
  "/subir-imagen/:id",
  protegerRuta,
  validarId,
  validateResult,
  uploadCategoria,
  subirImagenCategoria,
);

export default router;
