// controllers/pedidoController.js
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";

export const crearPedido = async (req, res) => {
  try {
    const { nombre, dni, telefono, total, metodo_pago, carrito } = req.body;

    const estadoInicial = metodo_pago === "contra" ? "entregado" : "pendiente";

    const pedido = await Pedido.create({
      nombre_comprador: nombre,
      dni_comprador: dni,
      telefono_comprador: telefono,
      total_pedido: total,
      estado_pedido: estadoInicial,
    });

    for (const item of carrito) {
      await DetallePedido.create({
        pedido_id: pedido.id_pedido,
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
      });
    }

    res.status(201).json({ pedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear pedido" });
  }
};
