import cron from "node-cron";
import { Op } from "sequelize";
import ComprobantePago from "../src/modules/payments/payment.model.js";
import PagoAuditoria from "../models/PagoAuditoria.js";

cron.schedule("*/10 * * * *", async () => {
  console.log("⏰ Revisando comprobantes vencidos...");

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

  console.log(`⏰ ${comprobantes.length} comprobantes vencidos`);
});
