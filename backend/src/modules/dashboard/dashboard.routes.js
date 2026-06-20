import express from "express";
import protegerRuta from "../../shared/middleware/protegerRuta.js";

import { validarDashboard } from "./dashboard.validator.js";
import { validateResult } from "../../shared/middleware/validateResult.js";

import {
  estadisticasDashboard,
  actividadReciente,
} from "./dashboard.controller.js";

import requireRole from "../../shared/middleware/requireRole.js";

const router = express.Router();

/* =========================
   📊 Dashboard principal
========================= */
router.get(
  "/",
  protegerRuta,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validarDashboard, // 🧼 valida query params
  validateResult, // 🚨 maneja errores
  estadisticasDashboard,
);

/* =========================
   📋 Actividad reciente
========================= */
router.get(
  "/actividad",
  protegerRuta,
  requireRole("ADMIN", "SUPER_ADMIN"),
  validarDashboard, // 🧼 reutilizas el mismo validator
  validateResult,
  actividadReciente,
);

export default router;
