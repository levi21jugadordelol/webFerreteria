import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import uploadComprobante from "../../shared/middleware/uploadComprobante.js";
import { uploadLimiter } from "../../shared/middleware/rateLimiters.js";

import {
  subirComprobante,
  listarComprobantes,
  validarComprobante,
  rechazarComprobante,
  revertirComprobante,
} from "./payment.controller.js";

import {
  validarSubirComprobante,
  validarArchivoComprobante,
  validarIdComprobante,
} from "./payment.validator.js";

const router = express.Router();

/* -----------------------------
   🟢 CLIENTE
----------------------------- */
router.post(
  "/comprobante",
  uploadLimiter,
  uploadComprobante,
  validarSubirComprobante,
  validarArchivoComprobante,
  subirComprobante,
);

/* -----------------------------
   🔒 ADMIN
----------------------------- */
router.get("/admin/lista", protegerRuta, listarComprobantes);

router.put(
  "/admin/:id/validar",
  protegerRuta,
  validarIdComprobante,
  validarComprobante,
);

router.put(
  "/admin/:id/revertir",
  protegerRuta,
  validarIdComprobante,
  revertirComprobante,
);

router.put(
  "/admin/:id/rechazar",
  protegerRuta,
  validarIdComprobante,
  rechazarComprobante,
);

export default router;
