// dashboard.service.js
import { Op, fn, col, literal } from "sequelize";
import Producto from "../products/producto.model.js";
import Pedido from "../orders/order.model.js";
import ComprobantePago from "../payments/payment.model.js";
import PagoAuditoria from "../audit-payments/auditPayment.model.js";
import AppError from "../../shared/utils/AppError.js";

export const obtenerEstadisticas = async (filtros) => {
  const { desde, hasta } = filtros;

  if (desde && hasta && new Date(desde) > new Date(hasta)) {
    throw new AppError("Rango de fechas inválido", 400);
  }

  let whereFecha = {};

  if (desde || hasta) {
    if (desde) whereFecha[Op.gte] = desde;
    if (hasta) whereFecha[Op.lte] = hasta;
  }

  const filtroPedido = {
    estado_pedido: "pagado",
    ...(Object.keys(whereFecha).length && { fecha_hora: whereFecha }),
  };

  const [totalProductos, pagosPendientes, ventas, stockBajo] =
    await Promise.all([
      Producto.count(),

      ComprobantePago.count({
        where: { estado_validacion: "pendiente" },
      }),

      Pedido.findAll({
        where: filtroPedido,
      }),

      Producto.count({
        where: literal("(stock_total - stock_reservado) <= 5"),
      }),
    ]);

  const totalVentas = ventas.length;

  const ingresos = ventas.reduce(
    (acc, v) => acc + Number(v.total_pedido || 0),
    0,
  );

  return {
    totalProductos,
    totalVentas,
    ingresos,
    pagosPendientes,
    stockBajo,
  };
};

export const obtenerActividad = async (limit = 8, offset = 0) => {
  return await PagoAuditoria.findAll({
    limit,
    offset,
    order: [["fecha", "DESC"]],
  });
};

export const ventasPorDia = async (desde, hasta) => {
  let where = {
    estado_pedido: "pagado",
  };

  if (desde || hasta) {
    where.fecha_hora = {};

    if (desde) where.fecha_hora[Op.gte] = desde;
    if (hasta) where.fecha_hora[Op.lte] = hasta;
  }

  return Pedido.findAll({
    attributes: [
      [fn("DATE", col("fecha_hora")), "fecha"],
      [fn("COUNT", col("id_pedido")), "totalVentas"],
      [fn("SUM", col("total_pedido")), "ingresos"],
    ],
    where,
    group: [fn("DATE", col("fecha_hora"))],
    order: [[literal("fecha"), "ASC"]],
    raw: true,
  });
};

export const ventasPorMes = async () => {
  return Pedido.findAll({
    attributes: [
      [fn("DATE_FORMAT", col("fecha_hora"), "%Y-%m"), "mes"],
      [fn("COUNT", col("id_pedido")), "totalVentas"],
      [fn("SUM", col("total_pedido")), "ingresos"],
    ],
    where: {
      estado_pedido: "pagado",
    },
    group: [literal("mes")],
    order: [[literal("mes"), "ASC"]],
    raw: true,
  });
};

export const obtenerKPIs = async (ventas) => {
  const totalVentas = ventas.reduce(
    (acc, v) => acc + Number(v.totalVentas || 0),
    0,
  );

  const ingresos = ventas.reduce((acc, v) => acc + Number(v.ingresos || 0), 0);

  const ticketPromedio = totalVentas > 0 ? ingresos / totalVentas : 0;

  return {
    totalVentas,
    ingresos,
    ticketPromedio,
  };
};
