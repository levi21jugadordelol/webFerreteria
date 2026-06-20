import { query } from "express-validator";

export const validarFiltroFechas = [
  query("desde")
    .optional()
    .isISO8601()
    .withMessage("Fecha 'desde' inválida")
    .toDate(),

  query("hasta")
    .optional()
    .isISO8601()
    .withMessage("Fecha 'hasta' inválida")
    .toDate(),
];
