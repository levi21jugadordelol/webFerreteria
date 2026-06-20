import { check, param } from "express-validator";

/* =========================
   🆔 ID
========================= */
export const validarIdMenu = [param("id").isInt().withMessage("ID inválido")];

/* =========================
   🟢 CREAR
========================= */
export const validarCrearMenu = [
  check("titulo")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 2, max: 80 })
    .withMessage("El título debe tener entre 2 y 80 caracteres"),

  check("tipo")
    .notEmpty()
    .isIn(["pagina", "ruta"])
    .withMessage("Tipo inválido"),

  check("url")
    .trim()
    .notEmpty()
    .withMessage("La URL es obligatoria")
    .matches(/^\/[a-zA-Z0-9/_-]*$/)
    .withMessage("La URL debe ser una ruta interna válida"),

  check("orden").optional().isInt({ min: 0 }).toInt(),

  check("activo").optional().isBoolean().toBoolean(),

  check("parent_id")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("parent_id inválido")
    .toInt(),
];

/* =========================
   🔄 ACTUALIZAR
========================= */
export const validarActualizarMenu = [
  check("titulo")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .isLength({ min: 2, max: 80 })
    .withMessage("El título debe tener entre 2 y 80 caracteres"),

  check("tipo")
    .optional()
    .isIn(["pagina", "ruta"])
    .withMessage("Tipo inválido"),

  check("url")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La URL no puede estar vacía")
    .matches(/^\/[a-zA-Z0-9/_-]*$/)
    .withMessage("La URL debe ser una ruta interna válida"),

  check("orden").optional().isInt({ min: 0 }).toInt(),

  check("activo").optional().isBoolean().toBoolean(),

  check("parent_id")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("parent_id inválido")
    .toInt(),
];

/* =========================
   🔄 ORDEN
========================= */
export const validarOrdenMenu = [
  check("menus").isArray().withMessage("Debe ser un array"),

  check("menus.*.id_menu").isInt().withMessage("ID inválido"),

  check("menus.*.orden").isInt().withMessage("Orden inválido"),
];
