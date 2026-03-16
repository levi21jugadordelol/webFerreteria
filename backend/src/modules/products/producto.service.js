import { Op } from "sequelize";
import Producto from "./producto.model.js";
import Categoria from "../categories/category.model.js";
import ProductoImagen from "../productImagen/productImg.model.js";
import ProductoCaracteristica from "../productCaracteristica/productCarac.model.js";
import ProductoTab from "../productoTab/productoTab.model.js";

class ProductoService {
  /* =====================================================
     🟢 LISTADO PÚBLICO (CATÁLOGO)
     ===================================================== */
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
        "slug",
        "descripcion",
        "precio",
        "url_imagen",
        "stock",
        "es_destacado",
        "es_temporada",
      ],
      order: [["id_producto", "DESC"]],
    });

    return productos.map((p) => ({
      ...p.toJSON(),
      agotado: p.stock <= 0, // 🔥 regla de dominio
      disponible: p.stock > 0,
    }));
  }

  /* =====================================================
     🟢 OBTENER PRODUCTO (DETALLE)
     ===================================================== */
  static async obtenerPorId(id) {
    const producto = await Producto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["nombre_categoria"],
        },

        {
          model: ProductoImagen,
          as: "imagenes",
        },

        {
          model: ProductoCaracteristica,
          as: "caracteristicas",

          include: [
            {
              model: ProductoTab,
              as: "tab",
              attributes: ["id_tab", "nombre", "slug", "orden", "activo"],
            },
          ],

          order: [["orden", "ASC"]],
        },
      ],
    });

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    const data = producto.toJSON();

    const tabs = {};

    for (const carac of data.caracteristicas) {
      if (!carac.tab || !carac.tab.activo) continue; // ← AQUÍ VA

      const slug = carac.tab.slug;

      if (!tabs[slug]) {
        tabs[slug] = {
          nombre: carac.tab.nombre,
          orden: carac.tab.orden,
          items: [],
        };
      }

      tabs[slug].items.push({
        titulo: carac.titulo,
        valor: carac.valor,
        orden: carac.orden,
      });
    }

    return {
      ...data,
      tabs,
      agotado: producto.stock <= 0,
      disponible: producto.stock > 0,
    };
  }

  /* =====================================================
   🟢 OBTENER PRODUCTO POR SLUG (PÚBLICO)
   ===================================================== */
  static async obtenerPorSlug(slug) {
    const producto = await Producto.findOne({
      where: { slug },

      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["nombre_categoria"],
        },

        {
          model: ProductoImagen,
          as: "imagenes",
        },

        {
          model: ProductoCaracteristica,
          as: "caracteristicas",

          include: [
            {
              model: ProductoTab,
              as: "tab",
              attributes: ["id_tab", "nombre", "slug", "orden", "activo"],
            },
          ],

          order: [["orden", "ASC"]],
        },
      ],
    });

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    const data = producto.toJSON();

    const tabs = {};

    for (const carac of data.caracteristicas) {
      if (!carac.tab || !carac.tab.activo) continue;

      const slugTab = carac.tab.slug;

      if (!tabs[slugTab]) {
        tabs[slugTab] = {
          nombre: carac.tab.nombre,
          orden: carac.tab.orden,
          items: [],
        };
      }

      tabs[slugTab].items.push({
        titulo: carac.titulo,
        valor: carac.valor,
        orden: carac.orden,
      });
    }

    return {
      ...data,
      tabs,
      agotado: producto.stock <= 0,
      disponible: producto.stock > 0,
    };
  }

  /* =====================================================
     🟢 PRODUCTOS HOME (DESTACADOS / TEMPORADA)
     ===================================================== */
  static async listarHome({ tipo = "temporada", limit = 8 } = {}) {
    const now = new Date();
    const where = {
      stock: { [Op.gt]: 0 }, // ❗ nunca mostrar agotados en home
    };

    if (tipo === "destacados") {
      where.es_destacado = true;
    } else {
      // temporada por defecto
      where.es_temporada = true;

      where[Op.and] = [
        {
          [Op.or]: [
            { temporada_inicio: null },
            { temporada_inicio: { [Op.lte]: now } },
          ],
        },
        {
          [Op.or]: [
            { temporada_fin: null },
            { temporada_fin: { [Op.gte]: now } },
          ],
        },
      ];
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
        "es_destacado",
        "es_temporada",
        "temporada_inicio",
        "temporada_fin",
      ],
      limit: Number(limit),
      order: [["id_producto", "DESC"]],
    });

    return productos.map((p) => ({
      ...p.toJSON(),
      agotado: p.stock <= 0,
      disponible: p.stock > 0,
    }));
  }
}

export default ProductoService;
