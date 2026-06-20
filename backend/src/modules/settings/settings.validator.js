import { body } from "express-validator";

/* =========================
   VALIDAR UPDATE SETTINGS
========================= */
export const validarUpdateSettings = [
  body().isObject().withMessage("El body debe ser un objeto válido"),
];
