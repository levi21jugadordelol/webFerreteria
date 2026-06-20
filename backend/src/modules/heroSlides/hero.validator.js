import { check, param } from "express-validator";

/* =========================
   🆔 ID
========================= */
export const validarIdHero = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido").toInt(),
];

/* =========================
   🟢 CREAR
========================= */
export const validarCrearHero = [
  check("titulo1")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Máximo 100 caracteres"),

  check("titulo2")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Máximo 100 caracteres"),

  check("tipo_layout")
    .optional()
    .isIn(["banner", "text-left", "text-right", "centered", "triple"])
    .withMessage("Tipo de layout inválido"),

  check("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Orden inválido")
    .toInt(),

  check("boton_texto")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Máximo 100 caracteres"),

  check("boton_url")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\/[a-zA-Z0-9/_?=&-]*$/)
    .withMessage("La URL del botón debe ser una ruta interna válida"),

  check("link_url")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\/[a-zA-Z0-9/_?=&-]*$/)
    .withMessage("La URL debe ser una ruta interna válida"),

  check("activo").optional(),

  check("mostrar_boton").optional(),
];

/* =========================
   🔄 ACTUALIZAR
========================= */
export const validarActualizarHero = [
  check("titulo1")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Máximo 100 caracteres"),

  check("titulo2")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Máximo 100 caracteres"),

  check("boton_texto")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Máximo 100 caracteres"),

  check("tipo_layout")
    .optional()
    .isIn(["banner", "text-left", "text-right", "centered", "triple"])
    .withMessage("Tipo de layout inválido"),

  check("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Orden inválido")
    .toInt(),

  check("boton_url")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\/[a-zA-Z0-9/_?=&-]*$/)
    .withMessage("La URL del botón debe ser una ruta interna válida"),

  check("link_url")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\/[a-zA-Z0-9/_?=&-]*$/)
    .withMessage("La URL debe ser una ruta interna válida"),

  check("activo").optional(),

  check("mostrar_boton").optional(),
];

/* =========================
   🔄 ORDEN
========================= */
export const validarOrdenHero = [
  check("slides").isArray({ min: 1 }).withMessage("Debe ser un array válido"),

  check("slides.*.id_hero")
    .isInt({ min: 1 })
    .withMessage("ID inválido en orden"),

  check("slides.*.orden").isInt({ min: 0 }).withMessage("Orden inválido"),
];
