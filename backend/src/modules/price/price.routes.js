import express from "express";
import { filtrarPorPrecio } from "./price.controller.js";
import { validarFiltroPrecio } from "./price.validator.js";

const router = express.Router();

// Ruta pública para precios
router.get("/precio", validarFiltroPrecio, filtrarPorPrecio);

export default router;
