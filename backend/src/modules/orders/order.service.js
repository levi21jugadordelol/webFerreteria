import sequelize from "../../config/db.js";
import Pedido from "../orders/order.model.js";
import DetallePedido from "../orderDetails/orderDetail.model.js";
import Producto from "../products/producto.model.js";
import logger from "../../shared/logger/logger.js";

class PedidoService {
  static async crear(data) {
    logger.info({
      message: "Starting order creation",
      data,
    });

    const transaction = await sequelize.transaction();

    try {
      const { nombre, dni, telefono, direccion, total, metodo_pago, carrito } =
        data;

      if (!carrito || carrito.length === 0) {
        throw new Error("El carrito está vacío");
      }

      // 🔥 AGRUPAR PRODUCTOS
      const agrupado = {};

      for (const item of carrito) {
        if (!agrupado[item.id]) agrupado[item.id] = 0;
        agrupado[item.id] += item.cantidad;
      }

      logger.debug({
        message: "Grouped cart",
        agrupado,
      });

      // 🔥 VALIDAR STOCK
      for (const id in agrupado) {
        const cantidadTotal = agrupado[id];

        const producto = await Producto.findByPk(id, {
          transaction,
          lock: true,
        });

        if (!producto) {
          throw new Error(`Producto ${id} no existe`);
        }

        if (producto.stock < cantidadTotal) {
          const error = new Error(
            `Stock insuficiente para ${producto.nombre_producto}`,
          );

          error.type = "STOCK_ERROR";
          error.producto_id = producto.id_producto;
          error.stock_disponible = producto.stock;

          throw error;
        }

        await producto.decrement("stock", {
          by: cantidadTotal,
          transaction,
        });
      }

      // 🔥 CREAR PEDIDO
      const estadoInicial =
        metodo_pago === "contra" ? "entregado" : "pendiente";

      const pedido = await Pedido.create(
        {
          nombre_comprador: nombre,
          dni_comprador: dni,
          telefono_comprador: telefono,
          direccion_envio: direccion,
          total_pedido: total,
          estado_pedido: estadoInicial,
        },
        { transaction },
      );

      logger.info({
        message: "Order created",
        id: pedido.id_pedido,
      });

      // 🔥 DETALLES
      for (const item of carrito) {
        await DetallePedido.create(
          {
            pedido_id: pedido.id_pedido,
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
          },
          { transaction },
        );
      }

      await transaction.commit();

      logger.info({
        message: "Transaction committed",
        orderId: pedido.id_pedido,
      });

      return pedido;
    } catch (error) {
      await transaction.rollback();

      logger.error({
        message: "Transaction rollback - error creating order",
        error: error.message,
        type: error.type || "GENERAL",
      });

      throw error;
    }
  }
}

export default PedidoService;
