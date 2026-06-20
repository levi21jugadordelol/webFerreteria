import sequelize from "../../config/db.js";
import Pedido from "../orders/order.model.js";
import DetallePedido from "../orderDetails/orderDetail.model.js";
import Producto from "../products/producto.model.js";
import logger from "../../shared/logger/logger.js";
import AppError from "../../shared/utils/AppError.js";

class PedidoService {
  static async crear(data) {
    logger.info({
      message: "Starting order creation",
      metodo_pago: data.metodo_pago,
      carritoItems: data.carrito?.length ?? 0,
    });

    const transaction = await sequelize.transaction();

    try {
      const {
        nombre,
        telefono,
        direccion,
        tipo_documento = "SIN_DOCUMENTO",
        numero_documento = null,
        metodo_pago,
        carrito,
      } = data;

      if (!Array.isArray(carrito) || carrito.length === 0) {
        throw new AppError("El carrito está vacío", 400);
      }

      const agrupado = {};

      for (const item of carrito) {
        const productoId = Number(item.id);
        const cantidad = Number(item.cantidad);

        if (!agrupado[productoId]) {
          agrupado[productoId] = 0;
        }

        agrupado[productoId] += cantidad;
      }

      const productosCache = {};
      let totalPedido = 0;

      for (const id in agrupado) {
        const cantidadTotal = agrupado[id];

        const producto = await Producto.findByPk(id, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!producto) {
          throw new AppError(`Producto ${id} no existe`, 404);
        }

        const disponible =
          Number(producto.stock_total) - Number(producto.stock_reservado);

        if (disponible < cantidadTotal) {
          throw new AppError(
            `Stock insuficiente para ${producto.nombre_producto}`,
            400,
            {
              type: "STOCK_ERROR",
              producto_id: producto.id_producto,
              stock_disponible: disponible,
            },
          );
        }

        const precioUnitario = Number(producto.precio);
        totalPedido += precioUnitario * cantidadTotal;

        productosCache[id] = producto;
      }

      for (const id in agrupado) {
        const producto = productosCache[id];

        producto.stock_reservado =
          Number(producto.stock_reservado) + agrupado[id];

        await producto.save({ transaction });
      }

      const estadoInicial = "pendiente";

      const pedido = await Pedido.create(
        {
          nombre_comprador: nombre,
          tipo_documento,
          numero_documento:
            tipo_documento === "SIN_DOCUMENTO" ? null : numero_documento,
          telefono_comprador: telefono,
          direccion_envio: direccion,
          total_pedido: totalPedido,
          estado_pedido: estadoInicial,
        },
        { transaction },
      );

      for (const id in agrupado) {
        const producto = productosCache[id];

        await DetallePedido.create(
          {
            pedido_id: pedido.id_pedido,
            producto_id: producto.id_producto,
            cantidad: agrupado[id],
            precio_unitario: producto.precio,
          },
          { transaction },
        );
      }

      await transaction.commit();

      logger.info({
        message: "Order created",
        id: pedido.id_pedido,
        total_pedido: totalPedido,
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
