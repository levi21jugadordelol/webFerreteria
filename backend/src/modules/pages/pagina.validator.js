import { check, param } from "express-validator";
import { validateResult } from "../../shared/middleware/validateResult.js";

export const validarIdPagina = [
  param("id").isInt({ min: 1 }).withMessage("El ID debe ser numérico").toInt(),

  validateResult,
];

export const validarBodyNoVacio = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      ok: false,
      message: "Debe enviar al menos un campo para actualizar",
    });
  }

  next();
};

export const validarCrearPagina = [
  check("titulo")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),

  check("slug")
    .notEmpty()
    .withMessage("El slug es obligatorio")
    .trim()
    .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-_]+$/)
    .withMessage("El slug contiene caracteres inválidos"),

  check("contenido")
    .notEmpty()
    .withMessage("El contenido es obligatorio")
    .isLength({ min: 5 })
    .withMessage("El contenido es demasiado corto"),

  check("template")
    .optional()
    .isIn(["default", "image-left", "image-right", "hero"])
    .withMessage("Template inválido"),

  check("imagen_portada")
    .optional({ checkFalsy: true })
    .isURL({
      protocols: ["http", "https"],
      require_protocol: false,
    })
    .withMessage("Debe ser una URL válida"),

  check("meta_description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 160 })
    .withMessage("Máximo 160 caracteres"),

  validateResult,
];

export const validarActualizarPagina = [
  check("titulo")
    .optional()
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),

  check("slug")
    .optional()
    .notEmpty()
    .withMessage("El slug no puede estar vacío")
    .trim()
    .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-_]+$/)
    .withMessage("El slug contiene caracteres inválidos"),

  check("contenido")
    .optional()
    .notEmpty()
    .withMessage("El contenido no puede estar vacío")
    .isLength({ min: 5 })
    .withMessage("El contenido es demasiado corto"),

  check("template")
    .optional()
    .isIn(["default", "image-left", "image-right", "hero"])
    .withMessage("Template inválido"),

  check("imagen_portada")
    .optional({ checkFalsy: true })
    .isURL({
      protocols: ["http", "https"],
      require_protocol: false,
    })
    .withMessage("Debe ser una URL válida"),

  check("meta_description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 160 })
    .withMessage("Máximo 160 caracteres"),

  check("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser booleano"),

  validateResult,
];

export const validarSlugPagina = [
  param("slug")
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug inválido"),

  validateResult,
];
