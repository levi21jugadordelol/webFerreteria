import PagoAuditoria from "../audit-payments/auditPayment.model.js";
import logger from "../../shared/logger/logger.js";

export const listarAuditoriaPagos = async (req, res) => {
  try {
    logger.info({
      message: "Fetching payment audit logs",
      user: req.admin?.id_administrador,
    });

    const logs = await PagoAuditoria.findAll({
      order: [["fecha", "DESC"]],
    });

    return res.json(logs);
  } catch (error) {
    logger.error({
      message: "Error fetching payment audit logs",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al obtener auditoría de pagos",
    });
  }
};
