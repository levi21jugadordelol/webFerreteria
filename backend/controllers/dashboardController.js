import Producto from "../src/modules/products/producto.model.js";
import Pedido from "../src/modules/orders/order.model.js";
import ComprobantePago from "../src/modules/payments/payment.model.js";
import PagoAuditoria from "../models/PagoAuditoria.js";

export const estadisticasDashboard = async (req, res) => {
  const totalProductos = await Producto.count();

  const pagosPendientes = await ComprobantePago.count({
    where: { estado_validacion: "pendiente" },
  });

  const ventasHoy = await Pedido.count({
    where: {
      estado_pedido: "pagado",
    },
  });

  const stockBajo = await Producto.count({
    where: {
      stock: 5,
    },
  });

  res.json({
    totalProductos,
    ventasHoy,
    pagosPendientes,
    stockBajo,
  });
};

export const actividadReciente = async (req, res) => {
  const logs = await PagoAuditoria.findAll({
    limit: 8,
    order: [["fecha", "DESC"]],
  });

  res.json(logs);
};
