import db from "../../config/db.js";
import ComprobantePago from "./payment.model.js";
import Pedido from "../orders/order.model.js";
import DetallePedido from "../orderDetails/orderDetail.model.js";
import Producto from "../products/producto.model.js";
import PagoAuditoria from "../audit-payments/auditPayment.model.js";
import { Op, where, col } from "sequelize";
import logger from "../../shared/logger/logger.js";
import AppError from "../../shared/utils/AppError.js";
import { subirImagenEditorService } from "../uploads/upload.service.js";

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

      if (!comprobante) throw new AppError("Comprobante no encontrado", 404);

      if (comprobante.estado_validacion === "validado") {
        throw new AppError("Este comprobante ya fue validado", 400);
      }

      const pedido = await Pedido.findByPk(comprobante.pedido_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!pedido) throw new AppError("Pedido no encontrado", 404);

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
          throw new AppError(`Producto ${d.producto_id} no encontrado`, 404);
        }

        const disponible = producto.stock_total - producto.stock_reservado;

        if (disponible < d.cantidad) {
          throw new AppError(
            `Stock insuficiente para ${producto.nombre_producto}`,
            400,
            {
              producto_id: producto.id_producto,
              stock_disponible: disponible,
              type: "STOCK_ERROR",
            },
          );
        }

        producto.stock_reservado -= d.cantidad;
        producto.stock_total -= d.cantidad;

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
          pedido_id: pedido.id_pedido,
          accion: "validado",
          admin_usuario: admin?.nombre || admin,
          estado_anterior: "pendiente",
          estado_nuevo: "validado",
        },
        { transaction: t },
      );

      logger.info({
        message: "Payment validated",
        comprobanteId: Number(id),
        adminId: admin?.id_administrador ?? null,
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

      if (!comprobante) {
        throw new AppError("Comprobante no encontrado", 404);
      }

      if (comprobante.estado_validacion !== "validado") {
        throw new AppError("Solo se pueden revertir pagos validados", 400);
      }

      const pedido = await Pedido.findByPk(comprobante.pedido_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!pedido) {
        throw new AppError("Pedido no encontrado", 404);
      }

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
          throw new AppError(`Producto ${d.producto_id} no encontrado`, 404);
        }

        // Al validar se descontó de stock_total.
        // Al revertir, se devuelve ese stock al inventario.
        producto.stock_total += d.cantidad;

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
          pedido_id: pedido.id_pedido,
          accion: "revertido",
          admin_usuario: admin?.nombre || admin,
          estado_anterior: "validado",
          estado_nuevo: "pendiente",
        },
        { transaction: t },
      );

      logger.info({
        message: "Payment reverted",
        comprobanteId: Number(id),
        adminId: admin?.id_administrador ?? null,
      });

      return true;
    });
  }

  static async expirarComprobantes() {
    const limite = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const comprobantes = await ComprobantePago.findAll({
      where: {
        estado_validacion: "pendiente",
        fecha_hora: { [Op.lt]: limite },
      },
    });

    for (const comprobante of comprobantes) {
      await db.transaction(async (t) => {
        const c = await ComprobantePago.findByPk(comprobante.id_comprobante, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!c || c.estado_validacion !== "pendiente") return;

        const pedido = await Pedido.findByPk(c.pedido_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!pedido) return;

        const detalles = await DetallePedido.findAll({
          where: { pedido_id: pedido.id_pedido },
          transaction: t,
        });

        for (const d of detalles) {
          const producto = await Producto.findByPk(d.producto_id, {
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          if (!producto) continue;

          producto.stock_reservado = Math.max(
            0,
            producto.stock_reservado - d.cantidad,
          );

          await producto.save({ transaction: t });
        }

        pedido.estado_pedido = "cancelado";
        await pedido.save({ transaction: t });

        c.estado_validacion = "vencido";
        await c.save({ transaction: t });

        await PagoAuditoria.create(
          {
            comprobante_id: c.id_comprobante,
            pedido_id: pedido.id_pedido,
            accion: "vencido",
            admin_usuario: "sistema",
            estado_anterior: "pendiente",
            estado_nuevo: "vencido",
          },
          { transaction: t },
        );
      });
    }
  }

  static async subirComprobante(data, file) {
    const { pedido_id } = data;

    if (!file) throw new AppError("Debe subir una imagen", 400);

    const pedido = await Pedido.findByPk(pedido_id);
    if (!pedido) throw new AppError("Pedido no encontrado", 404);

    const comprobantePendienteOValidado = await ComprobantePago.findOne({
      where: {
        pedido_id,
        estado_validacion: {
          [Op.in]: ["pendiente", "validado"],
        },
      },
    });

    if (comprobantePendienteOValidado) {
      throw new AppError(
        "Este pedido ya tiene un comprobante pendiente o validado",
        400,
      );
    }

    const intentosRechazados = await ComprobantePago.count({
      where: {
        pedido_id,
        estado_validacion: "rechazado",
      },
    });

    if (intentosRechazados >= 3) {
      logger.warn({
        event: "PAYMENT_MULTIPLE_FAILED_ATTEMPTS",
        pedidoId: Number(pedido_id),
        failedAttempts: intentosRechazados,
      });

      throw new AppError(
        "Este pedido superó el número máximo de intentos de comprobante",
        429,
      );
    }

    const upload = await subirImagenEditorService(file, "comprobantes");

    const comprobante = await ComprobantePago.create({
      pedido_id,
      url_imagen: upload.url,
      estado_validacion: "pendiente",
    });

    logger.info({
      event: "PAYMENT_PROOF_UPLOADED",
      pedidoId: Number(pedido_id),
      comprobanteId: comprobante.id_comprobante,
      failedAttemptsBefore: intentosRechazados,
    });

    return comprobante;
  }

  static async listarComprobantes({ search = "", page = 1, limit = 10 } = {}) {
    await this.expirarComprobantes();

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const offset = (pageNumber - 1) * limitNumber;

    const include = [
      {
        model: Pedido,
        as: "pedido",
        required: true,
        include: [
          {
            model: DetallePedido,
            as: "detalles",
            include: [
              {
                model: Producto,
                as: "producto",
                attributes: [
                  "id_producto",
                  "nombre_producto",
                  "slug",
                  "url_imagen",
                ],
              },
            ],
          },
        ],
      },
    ];

    const whereComprobante = {};

    if (search && search.trim()) {
      const q = search.trim();

      whereComprobante[Op.or] = [
        where(col("pedido.nombre_comprador"), {
          [Op.like]: `%${q}%`,
        }),
        where(col("pedido.numero_documento"), {
          [Op.like]: `%${q}%`,
        }),
        where(col("pedido.telefono_comprador"), {
          [Op.like]: `%${q}%`,
        }),
        where(col("pedido.id_pedido"), {
          [Op.eq]: Number(q) || 0,
        }),
      ];
    }

    const { rows, count } = await ComprobantePago.findAndCountAll({
      where: whereComprobante,
      include,
      distinct: true,
      limit: limitNumber,
      offset,
      order: [["fecha_hora", "DESC"]],
    });

    return {
      items: rows,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: count,
        totalPages: Math.ceil(count / limitNumber),
      },
    };
  }

  static async rechazarComprobante(id, admin = "admin") {
    return await db.transaction(async (t) => {
      const comprobante = await ComprobantePago.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!comprobante) {
        throw new AppError("Comprobante no encontrado", 404);
      }

      if (comprobante.estado_validacion !== "pendiente") {
        throw new AppError(
          "Solo se pueden rechazar comprobantes pendientes",
          400,
        );
      }

      const pedido = await Pedido.findByPk(comprobante.pedido_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!pedido) {
        throw new AppError("Pedido no encontrado", 404);
      }

      const detalles = await DetallePedido.findAll({
        where: { pedido_id: pedido.id_pedido },
        transaction: t,
      });

      for (const d of detalles) {
        const producto = await Producto.findByPk(d.producto_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!producto) continue;

        producto.stock_reservado = Math.max(
          0,
          producto.stock_reservado - d.cantidad,
        );

        await producto.save({ transaction: t });
      }

      pedido.estado_pedido = "cancelado";
      await pedido.save({ transaction: t });

      comprobante.estado_validacion = "rechazado";
      await comprobante.save({ transaction: t });

      await PagoAuditoria.create(
        {
          comprobante_id: comprobante.id_comprobante,
          pedido_id: pedido.id_pedido,
          accion: "rechazado",
          admin_usuario: admin?.nombre || admin,
          estado_anterior: "pendiente",
          estado_nuevo: "rechazado",
        },
        { transaction: t },
      );

      logger.info({
        message: "Payment rejected",
        comprobanteId: Number(id),
        adminId: admin?.id_administrador ?? null,
      });

      return true;
    });
  }
}

export default PagoService;
