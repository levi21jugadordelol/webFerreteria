// controllers/pedidoController.js

import PedidoService from "./order.service.js";
import logger from "../../shared/logger/logger.js";

export const crearPedido = async (req, res) => {
  try {
    logger.info({
      message: "Creating order",
      body: req.body,
    });

    const pedido = await PedidoService.crear(req.body);

    logger.info({
      message: "Order created successfully",
      id: pedido.id_pedido,
    });

    return res.status(201).json({ pedido });
  } catch (error) {
    logger.error({
      message: "Error creating order",
      error: error.message,
    });

    return res.status(400).json({
      msg: error.message,
      producto_id: error.producto_id || null,
      stock_disponible: error.stock_disponible || null,
    });
  }
};
