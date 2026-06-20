import { validationResult } from "express-validator";

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const erroresFormateados = errors
    .array({ onlyFirstError: true })
    .map((err) => ({
      campo: err.path,
      mensaje: err.msg,
    }));

  return res.status(400).json({
    ok: false,
    message: "Error de validación",
    errores: erroresFormateados,
  });
};
