// controllers/pedidoController.js

import PedidoService from "./order.service.js";

export const crearPedido = async (req, res) => {
  console.log("🔥🔥🔥 ENTRÓ A crearPedido");
  try {
    const pedido = await PedidoService.crear(req.body);
    res.status(201).json({ pedido });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
      producto_id: error.producto_id || null,
      stock_disponible: error.stock_disponible || null,
    });
  }
};
