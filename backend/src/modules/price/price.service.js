import Producto from "../products/producto.model.js";
import { Op } from "sequelize";
import AppError from "../../shared/utils/AppError.js";

class PriceService {
  static async filtrarPorPrecio(query) {
    const { min, max } = query;

    const where = {};

    const minNum = min !== undefined && min !== "" ? Number(min) : null;
    const maxNum = max !== undefined && max !== "" ? Number(max) : null;

    if (minNum !== null && Number.isNaN(minNum)) {
      throw new AppError("El precio mínimo debe ser válido", 400);
    }

    if (maxNum !== null && Number.isNaN(maxNum)) {
      throw new AppError("El precio máximo debe ser válido", 400);
    }

    if (minNum !== null && maxNum !== null && minNum > maxNum) {
      throw new AppError("El precio mínimo no puede ser mayor al máximo", 400);
    }

    if (minNum !== null) {
      where.precio = { ...(where.precio || {}), [Op.gte]: minNum };
    }

    if (maxNum !== null) {
      where.precio = { ...(where.precio || {}), [Op.lte]: maxNum };
    }

    return await Producto.findAll({
      where,
      attributes: [
        "id_producto",
        "nombre_producto",
        "descripcion",
        "precio",
        "url_imagen",
        "stock_total",
        "stock_reservado",
      ],
    });
  }
}

export default PriceService;
