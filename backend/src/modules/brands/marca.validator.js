import { check, param } from "express-validator";

export const validarCrearMarca = [
  check("nombre_marca")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la marca es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  check("descripcion")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("La descripción no puede superar 255 caracteres"),
];

export const validarActualizarMarca = [
  check("nombre_marca")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  check("descripcion")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("La descripción no puede superar 255 caracteres"),
];

export const validarId = [
  param("id").isInt().withMessage("El ID debe ser un número válido"),
];
