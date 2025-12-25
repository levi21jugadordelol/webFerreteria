import chalk from "chalk";
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import Producto from "../models/Producto.js";

class PedidoService {
  static async crear(data) {
    console.log(
      chalk.blueBright("🧾 [PedidoService] Iniciando creación de pedido")
    );

    const { nombre, dni, telefono, direccion, total, metodo_pago, carrito } =
      data;

    console.log(chalk.gray("📦 Carrito recibido:"), carrito);

    // 🔒 Validar stock
    for (const item of carrito) {
      console.log(
        chalk.yellow(
          `🔍 Validando stock producto ID=${item.id}, cantidad=${item.cantidad}`
        )
      );

      const producto = await Producto.findByPk(item.id);

      if (!producto) {
        console.log(chalk.red("❌ Producto no encontrado:", item.id));
        throw new Error(`Producto ${item.id} no existe`);
      }

      console.log(
        chalk.green(
          `📊 Stock actual=${producto.stock}, solicitado=${item.cantidad}`
        )
      );

      if (producto.stock < item.cantidad) {
        console.log(chalk.red("❌ Stock insuficiente"));
        throw new Error(`Stock insuficiente para producto ${item.id}`);
      }
    }

    const estadoInicial = metodo_pago === "contra" ? "entregado" : "pendiente";

    const pedido = await Pedido.create({
      nombre_comprador: nombre,
      dni_comprador: dni,
      telefono_comprador: telefono,
      direccion_envio: direccion,
      total_pedido: total,
      estado_pedido: estadoInicial,
    });

    console.log(
      chalk.greenBright("✅ Pedido creado con ID:", pedido.id_pedido)
    );

    for (const item of carrito) {
      console.log(
        chalk.cyan(
          `📝 Creando DetallePedido → pedido=${pedido.id_pedido}, producto=${item.id}`
        )
      );

      const detalle = await DetallePedido.create({
        pedido_id: pedido.id_pedido,
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
      });

      console.log(chalk.green("✔ Detalle creado ID:", detalle.id_detalle));
    }

    console.log(chalk.blueBright("🏁 PedidoService finalizado correctamente"));
    return pedido;
  }
}

export default PedidoService;
