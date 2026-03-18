import Producto from "../products/producto.model.js";
import { Op } from "sequelize";
import logger from "../../shared/logger/logger.js";

export const filtrarPorPrecio = async (req, res) => {
  try {
    const { min, max } = req.query;

    logger.info({
      message: "Filtering products by price",
      min,
      max,
    });

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
        "stock",
      ],
    });

    logger.info({
      message: "Products filtered by price",
      total: productos.length,
    });

    return res.json(productos);
  } catch (error) {
    logger.error({
      message: "Error filtering products by price",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al filtrar productos por precio",
    });
  }
};
