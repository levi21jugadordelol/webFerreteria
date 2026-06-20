import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import { listarAuditoriaPagosService } from "./auditPayment.service.js";

export const listarAuditoriaPagos = asyncHandler(async (req, res) => {
  logger.info({
    message: "Fetching payment audit logs",
    adminId: req.admin?.id_administrador,
    hasDesde: Boolean(req.query?.desde),
    hasHasta: Boolean(req.query?.hasta),
  });

  const logs = await listarAuditoriaPagosService(req.query);

  return res.success({
    data: logs,
  });
});
