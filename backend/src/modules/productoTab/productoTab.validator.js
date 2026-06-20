import { check, param } from "express-validator";
import { validateResult } from "../../shared/middleware/validateResult.js";

/* =============================
   VALIDAR ID
============================= */
export const validarIdTab = [
  param("id").isInt({ min: 1 }).withMessage("El ID debe ser numérico").toInt(),

  validateResult,
];

/* =============================
   VALIDAR CREAR TAB
============================= */
export const validarCrearTab = [
  check("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  check("slug")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El slug no puede estar vacío"),

  check("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número válido")
    .toInt(),

  validateResult,
];

/* =============================
   VALIDAR ACTUALIZAR TAB
============================= */
export const validarActualizarTab = [
  check("nombre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  check("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug inválido"),

  check("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser válido")
    .toInt(),

  check("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser booleano"),

  validateResult,
];
