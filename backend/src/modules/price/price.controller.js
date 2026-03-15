import Producto from "../products/producto.model.js";
import { Op } from "sequelize";
import chalk from "chalk";

export const filtrarPorPrecio = async (req, res) => {
  try {
    const { min, max } = req.query;

    const where = {};

    const minNum = min ? Number(min) : null;
    const maxNum = max ? Number(max) : null;

    if (minNum !== null && !isNaN(minNum)) {
      where.precio = { ...(where.precio || {}), [Op.gte]: minNum };
    }

    if (maxNum !== null && !isNaN(maxNum)) {
      where.precio = { ...(where.precio || {}), [Op.lte]: maxNum };
    }

    const productos = await Producto.findAll({
      where,
      attributes: [
        "id_producto",
        "nombre_producto",
        "descripcion",
        "precio",
        "url_imagen",
        "stock", // 👈 AGREGA ESTO
      ],
    });

    res.json(productos);
    console.log(
      chalk.cyan(`📦 Productos por precio devueltos: ${productos.length}`),
    );
  } catch (error) {
    console.error("❌ Error al filtrar productos por precio:", error);
    res.status(500).json({ msg: "Error al filtrar productos por precio" });
  }
};
