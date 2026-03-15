import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";
import { listarAuditoriaPagos } from "../audit-payments/auditPayment.controller.js";

const router = express.Router();

router.get("/pagos", protegerRuta, listarAuditoriaPagos);

export default router;
