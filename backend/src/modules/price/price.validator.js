import { query } from "express-validator";
import { validateResult } from "../../shared/middleware/validateResult.js";

export const validarFiltroPrecio = [
  query("min")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio mínimo debe ser válido"),

  query("max")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio máximo debe ser válido"),

  validateResult,
];
