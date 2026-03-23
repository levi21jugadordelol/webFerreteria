import cron from "node-cron";
import { Op } from "sequelize";
import ComprobantePago from "../modules/payments/payment.model.js";
import PagoAuditoria from "../modules/audit-payments/auditPayment.model.js";
import logger from "../shared/logger/logger.js";

cron.schedule("*/10 * * * *", async () => {
  try {
    logger.info({
      message: "⏰ Iniciando revisión de comprobantes vencidos",
    });

    const limite = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const comprobantes = await ComprobantePago.findAll({
      where: {
        estado_validacion: "pendiente",
        fecha_hora: {
          [Op.lt]: limite,
        },
      },
    });

    for (const c of comprobantes) {
      c.estado_validacion = "vencido";
      await c.save();

      await PagoAuditoria.create({
        comprobante_id: c.id_comprobante,
        accion: "vencido",
        admin_usuario: "sistema",
        estado_anterior: "pendiente",
        estado_nuevo: "vencido",
      });
    }

    logger.info({
      message: "⏰ Comprobantes procesados",
      total: comprobantes.length,
    });

    logger.info({
      message: "Procesando comprobante vencido",
      comprobanteId: c.id_comprobante,
    });
  } catch (error) {
    logger.error({
      message: "❌ Error en cron de pagos",
      error: error.message,
    });
  }
});
