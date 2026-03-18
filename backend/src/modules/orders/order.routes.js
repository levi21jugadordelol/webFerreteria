// routes/pedidoRouter.js
import express from "express";
import { crearPedido } from "./order.controller.js";

const router = express.Router();

/* 🟢 Público */
router.post("/", crearPedido);

export default router;
