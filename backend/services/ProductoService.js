import { Op } from "sequelize";
import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";
import ProductoImagen from "../models/ProductoImagen.js";
import ProductoCaracteristica from "../models/ProductoCaracteristica.js";

class ProductoService {
  static async listarPublicos({ search, marca, categoria }) {
    const where = {};

    if (search) {
      where[Op.or] = [
        { nombre_producto: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    if (marca) where.marca_id = marca;
    if (categoria) where.categoria_id = categoria;

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

    return productos.map((p) => ({
      ...p.toJSON(),
      agotado: p.stock <= 0, // 🔥 regla de dominio
    }));
  }

  static async obtenerPorId(id) {
    const producto = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria", attributes: ["nombre_categoria"] },
        { model: ProductoImagen, as: "imagenes" },
        { model: ProductoCaracteristica, as: "caracteristicas" },
      ],
    });

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    return {
      ...producto.toJSON(),
      agotado: producto.stock <= 0,
    };
  }
}

export default ProductoService;
