import { body, param } from "express-validator";

/* =========================
   VALIDAR CREAR PRODUCTO
========================= */
export const validarCrearProducto = [
  body("nombre_producto")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 3, max: 255 })
    .withMessage("El nombre debe tener entre 3 y 255 caracteres"),

  body("descripcion")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage("La descripción no debe superar 5000 caracteres"),

  body("precio")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0.01 })
    .withMessage("Precio inválido")
    .toFloat(),

  body("stock_total")
    .notEmpty()
    .withMessage("El stock es obligatorio")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser entero positivo")
    .toInt(),

  body("categoria_id")
    .notEmpty()
    .withMessage("Categoría requerida")
    .isInt({ min: 1 })
    .withMessage("Categoría inválida")
    .toInt(),

  body("marca_id")
    .notEmpty()
    .withMessage("Marca requerida")
    .isInt({ min: 1 })
    .withMessage("Marca inválida")
    .toInt(),

  body("es_destacado")
    .optional()
    .isBoolean()
    .withMessage("es_destacado debe ser booleano")
    .toBoolean(),

  body("es_temporada")
    .optional()
    .isBoolean()
    .withMessage("es_temporada debe ser booleano")
    .toBoolean(),

  body("temporada_inicio")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Fecha de inicio inválida"),

  body("temporada_fin")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Fecha de fin inválida"),
];

/* =========================
   VALIDAR ACTUALIZAR PRODUCTO
========================= */
export const validarActualizarProducto = [
  body("nombre_producto")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 3, max: 255 })
    .withMessage("El nombre debe tener entre 3 y 255 caracteres"),

  body("descripcion")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage("La descripción no debe superar 5000 caracteres"),

  body("precio")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Precio inválido")
    .toFloat(),

  body("stock_total")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser entero positivo")
    .toInt(),

  body("categoria_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Categoría inválida")
    .toInt(),

  body("marca_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Marca inválida")
    .toInt(),

  body("es_destacado")
    .optional()
    .isBoolean()
    .withMessage("es_destacado debe ser booleano")
    .toBoolean(),

  body("es_temporada")
    .optional()
    .isBoolean()
    .withMessage("es_temporada debe ser booleano")
    .toBoolean(),

  body("temporada_inicio")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Fecha de inicio inválida"),

  body("temporada_fin")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Fecha de fin inválida"),
];

/* =========================
   VALIDAR ID
========================= */
export const validarIdProducto = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido").toInt(),
];

/* =========================
   VALIDAR SLUG
========================= */
export const validarSlug = [
  param("slug")
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug inválido"),
];

/* =========================
   VALIDAR CARACTERISTICA
========================= */
export const validarCaracteristica = [
  body("titulo")
    .trim()
    .notEmpty()
    .withMessage("Título requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El título debe tener entre 2 y 100 caracteres"),

  body("valor")
    .trim()
    .notEmpty()
    .withMessage("Valor requerido")
    .isLength({ min: 1, max: 1000 })
    .withMessage("El valor debe tener máximo 1000 caracteres"),

  body("tab_id")
    .notEmpty()
    .withMessage("Tab requerido")
    .isInt({ min: 1 })
    .withMessage("Debe ser número")
    .toInt(),
];
