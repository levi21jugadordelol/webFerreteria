import { check, param } from "express-validator";
import { validateResult } from "../../shared/middleware/validateResult.js";

/* =============================
   VALIDAR ID (PARAMS)
============================= */
export const validarIdComprobante = [
  param("id").isInt().withMessage("El ID debe ser numérico"),

  validateResult,
];

/* =============================
   VALIDAR SUBIR COMPROBANTE
============================= */
export const validarSubirComprobante = [
  check("pedido_id")
    .notEmpty()
    .withMessage("El pedido_id es obligatorio")
    .isInt()
    .withMessage("El pedido_id debe ser numérico")
    .toInt(),

  validateResult,
];

/* =============================
   VALIDAR ARCHIVO
============================= */
export const validarArchivoComprobante = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      msg: "Debe subir una imagen",
    });
  }

  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!tiposPermitidos.includes(req.file.mimetype)) {
    return res.status(400).json({
      msg: "Formato de imagen no válido",
    });
  }

  next();
};
