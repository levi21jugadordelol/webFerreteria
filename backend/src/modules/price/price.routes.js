import express from "express";
import { filtrarPorPrecio } from "./price.controller.js";

const router = express.Router();

// Ruta pública para precios
router.get("/", filtrarPorPrecio);

export default router;
