// controllers/pedidoController.js
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import PedidoService from "../services/PedidoService.js";

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

// export const crearPedido = async (req, res) => {
//   console.log("🔥🔥🔥 ENTRÓ A crearPedido");
//   try {
//     const pedido = await PedidoService.crear(req.body);
//     res.status(201).json({ pedido });
//   } catch (error) {
//     res.status(400).json({
//       msg: error.message,
//       producto_id: error.producto_id || null,
//     });
//   }
// };
