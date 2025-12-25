import chalk from "chalk";
import db from "../config/db.js";
import ComprobantePago from "../models/Comprobante.js";
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import Producto from "../models/Producto.js";

class PagoService {
  static async validarComprobante(id) {
    console.log(chalk.blueBright("💳 [PagoService] Validar comprobante:", id));

    return await db.transaction(async (t) => {
      const comprobante = await ComprobantePago.findByPk(id, {
        transaction: t,
      });

      if (!comprobante) {
        console.log(chalk.red("❌ Comprobante no encontrado"));
        throw new Error("Comprobante no encontrado");
      }

      console.log(
        chalk.yellow(
          "🧾 Comprobante encontrado, pedido_id:",
          comprobante.pedido_id
        )
      );

      const pedido = await Pedido.findByPk(comprobante.pedido_id, {
        transaction: t,
      });

      if (!pedido) {
        console.log(chalk.red("❌ Pedido no encontrado"));
        throw new Error("Pedido no encontrado");
      }

      console.log(
        chalk.green(`📦 Pedido estado actual: ${pedido.estado_pedido}`)
      );

      const detalles = await DetallePedido.findAll({
        where: { pedido_id: pedido.id_pedido },
        transaction: t,
      });

      console.log(chalk.cyan(`📋 Detalles encontrados: ${detalles.length}`));

      if (detalles.length === 0) {
        console.log(chalk.red("❌ Pedido sin detalles"));
        throw new Error("Pedido sin detalles");
      }

      // 🔥 DESCONTAR STOCK
      for (const d of detalles) {
        console.log(
          chalk.yellow(
            `🔻 Descontando stock producto=${d.producto_id}, cantidad=${d.cantidad}`
          )
        );

        const producto = await Producto.findByPk(d.producto_id, {
          transaction: t,
        });

        console.log(chalk.gray(`📊 Stock antes: ${producto.stock}`));

        producto.stock -= d.cantidad;

        await producto.save({ transaction: t });

        console.log(chalk.green(`✅ Stock después: ${producto.stock}`));
      }

      pedido.estado_pedido = "pagado";
      await pedido.save({ transaction: t });

      comprobante.estado_validacion = "validado";
      await comprobante.save({ transaction: t });

      console.log(chalk.greenBright("🎉 Pago validado completamente"));

      return true;
    });
  }
}

export default PagoService;
