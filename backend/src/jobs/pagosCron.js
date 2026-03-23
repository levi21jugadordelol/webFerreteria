import cron from "node-cron";
import { Op } from "sequelize";

import ComprobantePago from "../modules/payments/payment.model.js";
import PagoAuditoria from "../modules/audit-payments/auditPayment.model.js";
import logger from "../shared/logger/logger.js";

// 🚨 Evita duplicación con nodemon
if (!global.cronPagosIniciado) {
  global.cronPagosIniciado = true;

  cron.schedule("*/10 * * * *", async () => {
    try {
      logger.info({
        message: "⏰ Iniciando revisión de comprobantes vencidos",
      });

      const limite = new Date(Date.now() - 3 * 60 * 60 * 1000);

      // 🔥 1. Obtener IDs primero (ligero)
      const comprobantes = await ComprobantePago.findAll({
        attributes: ["id_comprobante"],
        where: {
          estado_validacion: "pendiente",
          fecha_hora: {
            [Op.lt]: limite,
          },
        },
      });

      const ids = comprobantes.map((c) => c.id_comprobante);

      if (ids.length === 0) {
        logger.info({
          message: "✅ No hay comprobantes vencidos",
        });
        return;
      }

      // 🔥 2. Update masivo (MUCHO más rápido)
      await ComprobantePago.update(
        { estado_validacion: "vencido" },
        {
          where: {
            id_comprobante: ids,
          },
        },
      );

      // 🔥 3. Auditoría en lote
      const auditoria = ids.map((id) => ({
        comprobante_id: id,
        accion: "vencido",
        admin_usuario: "sistema",
        estado_anterior: "pendiente",
        estado_nuevo: "vencido",
      }));

      await PagoAuditoria.bulkCreate(auditoria);

      logger.info({
        message: "⏰ Comprobantes procesados",
        total: ids.length,
      });
    } catch (error) {
      logger.error(error, "❌ Error en cron de pagos");
    }
  });

  logger.info("🟢 Cron de pagos inicializado");
}
