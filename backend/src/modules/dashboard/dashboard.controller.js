import Producto from "../products/producto.model.js";
import Pedido from "../orders/order.model.js";
import ComprobantePago from "../payments/payment.model.js";
import PagoAuditoria from "../audit-payments/auditPayment.model.js";
import logger from "../../shared/logger/logger.js";

export const estadisticasDashboard = async (req, res) => {
  try {
    logger.info({
      message: "Fetching dashboard statistics",
      user: req.admin?.id_administrador,
    });

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

    logger.info({
      message: "Dashboard stats fetched",
      metrics: {
        totalProductos,
        ventasHoy,
        pagosPendientes,
        stockBajo,
      },
    });

    return res.json({
      totalProductos,
      ventasHoy,
      pagosPendientes,
      stockBajo,
    });
  } catch (error) {
    logger.error({
      message: "Error fetching dashboard statistics",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al obtener estadísticas",
    });
  }
};

export const actividadReciente = async (req, res) => {
  try {
    logger.info({
      message: "Fetching recent activity logs",
      user: req.admin?.id_administrador,
    });

    const logs = await PagoAuditoria.findAll({
      limit: 8,
      order: [["fecha", "DESC"]],
    });

    return res.json(logs);
  } catch (error) {
    logger.error({
      message: "Error fetching recent activity",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al obtener actividad reciente",
    });
  }
};
