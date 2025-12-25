// controllers/pedidoController.js
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import PedidoService from "../services/PedidoService.js";

export const crearPedido = async (req, res) => {
  try {
    const pedido = await PedidoService.crear(req.body);
    res.status(201).json({ pedido });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
