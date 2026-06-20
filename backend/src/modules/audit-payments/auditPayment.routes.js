import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import { listarAuditoriaPagos } from "./auditPayment.controller.js";
import { validarFiltroFechas } from "./auditPayment.validator.js";
import { validateResult } from "../../shared/middleware/validateResult.js";

const router = express.Router();
router.get(
  "/pagos",
  protegerRuta,
  validarFiltroFechas,
  validateResult,
  listarAuditoriaPagos,
);

export default router;
