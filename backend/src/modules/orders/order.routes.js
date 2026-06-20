import express from "express";
import { crearPedido } from "./order.controller.js";

import { validarCrearPedido } from "./order.validator.js";
import { validateResult } from "../../shared/middleware/validateResult.js";

import { orderLimiter } from "../../shared/middleware/rateLimiters.js";

const router = express.Router();

/* 🟢 Público */
router.post("/", orderLimiter, validarCrearPedido, validateResult, crearPedido);

export default router;
