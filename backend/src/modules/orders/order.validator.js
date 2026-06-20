import { check } from "express-validator";

import { TIPOS_DOCUMENTO, validarNumeroDocumento } from "./order.rules.js";

export const validarCrearPedido = [
  check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 3, max: 120 })
    .withMessage("El nombre debe tener entre 3 y 120 caracteres")
    .trim(),

  check("telefono")
    .notEmpty()
    .withMessage("El teléfono es obligatorio")
    .isLength({ min: 6, max: 15 })
    .withMessage("Teléfono inválido")
    .trim(),

  check("direccion")
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .isLength({ min: 5, max: 255 })
    .withMessage("La dirección debe tener entre 5 y 255 caracteres")
    .trim(),

  check("tipo_documento")
    .optional()
    .isIn(TIPOS_DOCUMENTO)
    .withMessage("Tipo de documento inválido"),

  check("numero_documento")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Número de documento inválido"),

  check("numero_documento").custom((value, { req }) => {
    const tipo = req.body.tipo_documento || "SIN_DOCUMENTO";

    return validarNumeroDocumento(tipo, value);
  }),

  check("metodo_pago")
    .notEmpty()
    .withMessage("El método de pago es obligatorio")
    .isIn(["contra", "online"])
    .withMessage("Método de pago inválido"),

  check("carrito")
    .isArray({ min: 1, max: 50 })
    .withMessage("El carrito no puede estar vacío"),

  check("carrito.*.id")
    .isInt({ min: 1 })
    .withMessage("ID de producto inválido"),

  check("carrito.*.cantidad")
    .isInt({ min: 1, max: 100 })
    .withMessage("Cantidad inválida"),
];
