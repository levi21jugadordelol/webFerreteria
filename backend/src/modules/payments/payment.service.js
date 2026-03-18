import db from "../../config/db.js";
import ComprobantePago from "./payment.model.js";
import Pedido from "../orders/order.model.js";
import DetallePedido from "../orderDetails/orderDetail.model.js";
import Producto from "../products/producto.model.js";
import PagoAuditoria from "../audit-payments/auditPayment.model.js";
import { Op } from "sequelize";
import logger from "../../shared/logger/logger.js";

class PagoService {
  /* ---------------------------------
     VALIDAR COMPROBANTE
  --------------------------------- */
  static async validarComprobante(id, admin = "admin") {
    return await db.transaction(async (t) => {
      const comprobante = await ComprobantePago.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!comprobante) throw new Error("Comprobante no encontrado");

      if (comprobante.estado_validacion === "validado") {
        throw new Error("Este comprobante ya fue validado");
      }

      const pedido = await Pedido.findByPk(comprobante.pedido_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!pedido) throw new Error("Pedido no encontrado");

      const detalles = await DetallePedido.findAll({
        where: { pedido_id: pedido.id_pedido },
        transaction: t,
      });

      for (const d of detalles) {
        const producto = await Producto.findByPk(d.producto_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!producto) {
          throw new Error(`Producto ${d.producto_id} no encontrado`);
        }

        if (producto.stock < d.cantidad) {
          throw new Error(
            `Stock insuficiente para ${producto.nombre_producto}`,
          );
        }

        producto.stock -= d.cantidad;
        await producto.save({ transaction: t });
      }

      pedido.estado_pedido = "pagado";
      await pedido.save({ transaction: t });

      comprobante.estado_validacion = "validado";
      comprobante.fecha_validacion_pago = new Date();
      await comprobante.save({ transaction: t });

      await PagoAuditoria.create(
        {
          comprobante_id: comprobante.id_comprobante,
          accion: "validado",
          admin_usuario: admin?.nombre || admin,
          estado_anterior: "pendiente",
          estado_nuevo: "validado",
        },
        { transaction: t },
      );

      logger.info({
        message: "Payment validated",
        id,
        admin: admin?.nombre || admin,
      });

      return true;
    });
  }

  /* ---------------------------------
     REVERTIR COMPROBANTE
  --------------------------------- */
  static async revertirComprobante(id, admin = "admin") {
    return await db.transaction(async (t) => {
      const comprobante = await ComprobantePago.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!comprobante) throw new Error("Comprobante no encontrado");

      if (comprobante.estado_validacion !== "validado") {
        throw new Error("Solo se pueden revertir pagos validados");
      }

      const pedido = await Pedido.findByPk(comprobante.pedido_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!pedido) throw new Error("Pedido no encontrado");

      const detalles = await DetallePedido.findAll({
        where: { pedido_id: pedido.id_pedido },
        transaction: t,
      });

      for (const d of detalles) {
        const producto = await Producto.findByPk(d.producto_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!producto) {
          throw new Error(`Producto ${d.producto_id} no encontrado`);
        }

        producto.stock += d.cantidad;
        await producto.save({ transaction: t });
      }

      pedido.estado_pedido = "pendiente";
      await pedido.save({ transaction: t });

      comprobante.estado_validacion = "pendiente";
      comprobante.fecha_validacion_pago = null;
      await comprobante.save({ transaction: t });

      await PagoAuditoria.create(
        {
          comprobante_id: comprobante.id_comprobante,
          accion: "revertido",
          admin_usuario: admin?.nombre || admin,
          estado_anterior: "validado",
          estado_nuevo: "pendiente",
        },
        { transaction: t },
      );

      logger.info({
        message: "Payment reverted",
        id,
        admin: admin?.nombre || admin,
      });

      return true;
    });
  }

  static async expirarComprobantes() {
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
      message: "Expired payment proofs",
      total: comprobantes.length,
    });
  }
}

export default PagoService;
