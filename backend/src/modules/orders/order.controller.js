import PedidoService from "./order.service.js";
import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

export const crearPedido = asyncHandler(async (req, res) => {
  logger.info({
    message: "Creating order",
    metodo_pago: req.body?.metodo_pago,
    carritoItems: req.body?.carrito?.length ?? 0,
  });

  const pedido = await PedidoService.crear(req.body);

  logger.info({
    message: "Order created successfully",
    id: pedido.id_pedido,
  });

  return res.success({
    status: 201,
    message: "Pedido creado correctamente",
    data: pedido,
  });
});
