import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import uploadComprobante from "../../shared/middleware/uploadComprobante.js";

import {
  subirComprobante,
  listarComprobantes,
  validarComprobante,
  rechazarComprobante,
  revertirComprobante,
} from "./payment.controller.js";

const router = express.Router();

// 🟢 Cliente
router.post("/comprobante", uploadComprobante.single("file"), subirComprobante);

// 🔒 Admin
router.get("/admin/lista", protegerRuta, listarComprobantes);
router.put("/admin/:id/validar", protegerRuta, validarComprobante);
router.put("/admin/:id/revertir", protegerRuta, revertirComprobante);
router.put("/admin/:id/rechazar", protegerRuta, rechazarComprobante);

export default router;
