import chalk from "chalk";
import sequelize from "../config/db.js";
import { Op } from "sequelize";
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import Producto from "../models/Producto.js";

class PedidoService {
  static async crear(data) {
    console.log(
      chalk.blueBright("🧾 [PedidoService] Iniciando creación de pedido"),
    );

    const transaction = await sequelize.transaction();

    try {
      const { nombre, dni, telefono, direccion, total, metodo_pago, carrito } =
        data;

      if (!carrito || carrito.length === 0) {
        throw new Error("El carrito está vacío");
      }

      console.log(chalk.gray("📦 Carrito original:"), carrito);

      // 🔥 1️⃣ AGRUPAR PRODUCTOS REPETIDOS
      const agrupado = {};

      for (const item of carrito) {
        if (!agrupado[item.id]) {
          agrupado[item.id] = 0;
        }
        agrupado[item.id] += item.cantidad;
      }

      console.log(chalk.gray("📦 Carrito agrupado:"), agrupado);

      // 🔥 2️⃣ VALIDAR Y DESCONTAR STOCK
      for (const id in agrupado) {
        const cantidadTotal = agrupado[id];

        console.log(
          chalk.yellow(
            `🔍 Validando producto ID=${id}, cantidad total=${cantidadTotal}`,
          ),
        );

        const producto = await Producto.findByPk(id, {
          transaction,
          lock: true, // 🔐 bloquea la fila
        });

        if (!producto) {
          throw new Error(`Producto ${id} no existe`);
        }

        console.log(
          chalk.yellow(
            `ANTES → Producto ${producto.id_producto} stock=${producto.stock}`,
          ),
        );

        if (producto.stock < cantidadTotal) {
          throw {
            type: "STOCK_ERROR",
            message: `Stock insuficiente para ${producto.nombre_producto}`,
            producto_id: producto.id_producto,
            stock_disponible: producto.stock,
          };

          error.producto_id = producto.id_producto;
          error.stock_disponible = producto.stock;

          throw error;
        }

        // 🔥 Descontar stock correctamente
        await producto.decrement("stock", {
          by: cantidadTotal,
          transaction,
        });

        console.log(
          chalk.magenta(
            `📉 Stock descontado correctamente para producto ${producto.id_producto}`,
          ),
        );
      }

      // 🔥 3️⃣ CREAR PEDIDO
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

      console.log(
        chalk.greenBright("✅ Pedido creado con ID:", pedido.id_pedido),
      );

      // 🔥 4️⃣ CREAR DETALLES (usar carrito original)
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

      console.log(chalk.green("💾 HACIENDO COMMIT"));

      // 🔥 5️⃣ CONFIRMAR TRANSACCIÓN
      await transaction.commit();

      console.log(
        chalk.blueBright("🏁 PedidoService finalizado correctamente"),
      );

      return pedido;
    } catch (error) {
      console.log(chalk.red("⛔ HACIENDO ROLLBACK"));
      await transaction.rollback();

      console.log(chalk.red("❌ Error en PedidoService:", error.message));

      throw error;
    }
  }
}

export default PedidoService;
