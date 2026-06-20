import PagoAuditoria from "../audit-payments/auditPayment.model.js";
import { Op } from "sequelize";
import AppError from "../../shared/utils/AppError.js";

/* =========================
   LISTAR AUDITORÍA PAGOS
========================= */
export const listarAuditoriaPagosService = async ({ desde, hasta }) => {
  // Validación de rango
  if (desde && hasta && desde > hasta) {
    throw new AppError("Rango de fechas inválido", 400);
  }

  let where = {};

  if (desde || hasta) {
    where.fecha = {};

    if (desde) where.fecha[Op.gte] = desde;
    if (hasta) where.fecha[Op.lte] = hasta;
  }

  const logs = await PagoAuditoria.findAll({
    where,
    order: [["fecha", "DESC"]],
    limit: 100,
  });

  return logs;
};
