import { query } from "express-validator";

export const validarDashboard = [
  query("desde").optional().isISO8601().toDate(),
  query("hasta").optional().isISO8601().toDate(),

  query("page").optional().isInt({ min: 1 }).toInt(),

  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];
