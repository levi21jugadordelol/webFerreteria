import express from "express";
import protegerRuta from "../middleware/protegerRuta.js";
import { listarAuditoriaPagos } from "../controllers/auditoriaController.js";

const router = express.Router();

router.get("/pagos", protegerRuta, listarAuditoriaPagos);

export default router;
