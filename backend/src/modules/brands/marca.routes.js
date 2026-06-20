import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import uploadMarca from "../../shared/middleware/uploadMarca.js";

import {
  crearMarca,
  listarMarcas,
  obtenerMarca,
  actualizarMarca,
  eliminarMarca,
  subirLogoMarca,
} from "../../modules/brands/marca.controller.js";

import {
  validarCrearMarca,
  validarActualizarMarca,
  validarId,
} from "../../modules/brands/marca.validator.js";

import { validateResult } from "../../shared/middleware/validateResult.js";

const router = express.Router();

/* =========================
   🟢 Públicas
========================= */
router.get("/", listarMarcas);

router.get("/:id", validarId, validateResult, obtenerMarca);

/* =========================
   🔒 Protegidas
========================= */
router.post("/", protegerRuta, validarCrearMarca, validateResult, crearMarca);

router.put(
  "/:id",
  protegerRuta,
  validarId,
  validarActualizarMarca,
  validateResult,
  actualizarMarca,
);

router.delete("/:id", protegerRuta, validarId, validateResult, eliminarMarca);

/* =========================
   🖼️ Subida de logo
========================= */
router.post(
  "/subir-logo/:id",
  protegerRuta,
  validarId,
  validateResult,
  uploadMarca,
  subirLogoMarca,
);

export default router;
