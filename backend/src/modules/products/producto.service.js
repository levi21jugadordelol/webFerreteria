import { Op } from "sequelize";
import Producto from "./producto.model.js";
import Categoria from "../categories/category.model.js";
import ProductoImagen from "../productImagen/productImg.model.js";
import ProductoCaracteristica from "../productCaracteristica/productCarac.model.js";
import ProductoTab from "../productoTab/productoTab.model.js";
import AppError from "../../shared/utils/AppError.js";
import { generarSlugUnico } from "../../shared/helpers/generarSlugUnico.js";

import sanitizeHtml from "sanitize-html";

import { subirImagenEditorService } from "../uploads/upload.service.js";

const sanitizarDescripcionProducto = (html = "") => {
  return sanitizeHtml(String(html), {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https"],
  });
};

class ProductoService {
  static async crearProducto(data, file, admin) {
    const {
      nombre_producto,
      descripcion,
      precio,
      stock_total,
      categoria_id,
      marca_id,
      es_destacado,
      es_temporada,
      temporada_inicio,
      temporada_fin,
    } = data;

    if (!admin) {
      throw new AppError("No autorizado", 401);
    }

    const nombreProducto = String(nombre_producto || "").trim();
    const descripcionLimpia = sanitizarDescripcionProducto(
      String(descripcion || "").trim(),
    );
    const precioFinal = Number(precio);
    const stockTotalFinal = Number(stock_total);
    const categoriaId = Number(categoria_id);
    const marcaId = Number(marca_id);

    const esDestacado =
      es_destacado === true || es_destacado === "true" || es_destacado === "on";

    const esTemporada =
      es_temporada === true || es_temporada === "true" || es_temporada === "on";

    if (!nombreProducto || nombreProducto.length < 3) {
      throw new AppError("Nombre de producto inválido", 400);
    }

    if (!categoriaId || !marcaId) {
      throw new AppError("Categoría y marca son obligatorias", 400);
    }

    if (Number.isNaN(precioFinal) || precioFinal <= 0) {
      throw new AppError("Precio inválido", 400);
    }

    if (Number.isNaN(stockTotalFinal) || stockTotalFinal < 0) {
      throw new AppError("Stock inválido", 400);
    }

    if (esTemporada && (!temporada_inicio || !temporada_fin)) {
      throw new AppError("Producto de temporada requiere fechas", 400);
    }

    const existe = await Producto.findOne({
      where: {
        nombre_producto: nombreProducto,
        marca_id: marcaId,
      },
    });

    if (existe) {
      throw new AppError("Producto duplicado para esta marca", 400);
    }

    let imagen = null;

    if (file) {
      const allowed = ["image/jpeg", "image/png", "image/webp"];

      if (!allowed.includes(file.mimetype)) {
        throw new AppError("Formato de imagen no permitido", 400);
      }

      const upload = await subirImagenEditorService(file, "productos");
      imagen = upload.url;
    }

    const slug = await generarSlugUnico({
      modelo: Producto,
      valor: nombreProducto,
      idCampo: "id_producto",
    });

    return await Producto.create({
      nombre_producto: nombreProducto,
      slug,
      descripcion: descripcionLimpia,
      precio: precioFinal,
      stock_total: stockTotalFinal,
      stock_reservado: 0,
      categoria_id: categoriaId,
      marca_id: marcaId,
      administrador_id: admin.id_administrador,
      url_imagen: imagen,
      es_destacado: esDestacado,
      es_temporada: esTemporada,
      temporada_inicio: temporada_inicio || null,
      temporada_fin: temporada_fin || null,
    });
  }

  static async agregarCaracteristica(productoId, data) {
    const titulo = sanitizeHtml(String(data.titulo || "").trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });

    const valor = sanitizeHtml(String(data.valor || "").trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });

    const tabId = Number(data.tab_id);

    if (!titulo || !valor || !tabId) {
      throw new AppError("Datos incompletos", 400);
    }

    const ultimoOrden = await ProductoCaracteristica.max("orden", {
      where: {
        producto_id: productoId,
        tab_id: tabId,
      },
    });

    return await ProductoCaracteristica.create({
      producto_id: productoId,
      titulo,
      valor,
      tab_id: tabId,
      orden: (ultimoOrden ?? -1) + 1,
    });
  }

  static async actualizarProducto(id, data) {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      throw new AppError("Producto no encontrado", 404);
    }

    const camposPermitidos = {};

    if (data.nombre_producto !== undefined) {
      camposPermitidos.nombre_producto = String(data.nombre_producto).trim();
    }

    if (data.descripcion !== undefined) {
      camposPermitidos.descripcion = String(data.descripcion || "").trim();
    }

    if (data.precio !== undefined) {
      camposPermitidos.precio = Number(data.precio);
    }

    if (data.stock_total !== undefined) {
      camposPermitidos.stock_total = Number(data.stock_total);
    }

    if (data.categoria_id !== undefined) {
      camposPermitidos.categoria_id = Number(data.categoria_id);
    }

    if (data.marca_id !== undefined) {
      camposPermitidos.marca_id = Number(data.marca_id);
    }

    if (data.es_destacado !== undefined) {
      camposPermitidos.es_destacado =
        data.es_destacado === true ||
        data.es_destacado === "true" ||
        data.es_destacado === "on";
    }

    if (data.es_temporada !== undefined) {
      camposPermitidos.es_temporada =
        data.es_temporada === true ||
        data.es_temporada === "true" ||
        data.es_temporada === "on";
    }

    if (data.temporada_inicio !== undefined) {
      camposPermitidos.temporada_inicio = data.temporada_inicio || null;
    }

    if (data.temporada_fin !== undefined) {
      camposPermitidos.temporada_fin = data.temporada_fin || null;
    }

    if (camposPermitidos.nombre_producto) {
      camposPermitidos.slug = await generarSlugUnico({
        modelo: Producto,
        valor: camposPermitidos.nombre_producto,
        excludeId: producto.id_producto,
        idCampo: "id_producto",
      });
    }

    await producto.update(camposPermitidos);

    return producto;
  }

  static async eliminarProducto(id) {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      throw new AppError("Producto no encontrado", 404);
    }

    await producto.destroy();
    return true;
  }

  static async eliminarImagenExtra(idImg) {
    const imagen = await ProductoImagen.findByPk(idImg);

    if (!imagen) {
      throw new AppError("Imagen no encontrada", 404);
    }

    await imagen.destroy();
    return true;
  }

  static async eliminarCaracteristica(idCarac) {
    const carac = await ProductoCaracteristica.findByPk(idCarac);

    if (!carac) {
      throw new AppError("Característica no encontrada", 404);
    }

    await carac.destroy();
    return true;
  }

  static async actualizarCaracteristica(idCarac, data) {
    const carac = await ProductoCaracteristica.findByPk(Number(idCarac));

    if (!carac) {
      throw new AppError("Característica no encontrada", 404);
    }

    const titulo = sanitizeHtml(String(data.titulo || "").trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });

    const valor = sanitizeHtml(String(data.valor || "").trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });
    const tabId = Number(data.tab_id);

    if (!titulo || !valor || !tabId) {
      throw new AppError("Datos incompletos", 400);
    }

    await carac.update({
      titulo,
      valor,
      tab_id: tabId,
    });

    return true;
  }

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

    const productos = await Producto.findAll({ where });

    return productos.map((p) => {
      const stockDisponible = p.stock_total - p.stock_reservado;

      return {
        ...p.toJSON(),
        stock_disponible: stockDisponible,
        agotado: stockDisponible <= 0,
        disponible: stockDisponible > 0,
      };
    });
  }

  static async productosRelacionados(slug) {
    const prod = await Producto.findOne({ where: { slug } });

    if (!prod) {
      throw new AppError("Producto no existe", 404);
    }

    return await Producto.findAll({
      where: {
        categoria_id: prod.categoria_id,
        id_producto: { [Op.ne]: prod.id_producto },
      },
      limit: 6,
    });
  }

  static async obtenerPorId(id) {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      throw new AppError("Producto no encontrado", 404);
    }

    return producto;
  }

  static async obtenerPorSlug(slug) {
    const producto = await Producto.findOne({ where: { slug } });

    if (!producto) {
      throw new AppError("Producto no encontrado", 404);
    }

    return producto;
  }

  static async subirImagenExtra(productoId, file) {
    if (!file) {
      throw new AppError("No se subió imagen", 400);
    }

    const upload = await subirImagenEditorService(file, "productos");

    return await ProductoImagen.create({
      producto_id: productoId,
      url: upload.url,
    });
  }

  static async listarHome({ tipo = "temporada", limit = 8 } = {}) {
    const where = {
      stock_total: { [Op.gt]: 0 },
    };

    if (tipo === "destacados") {
      where.es_destacado = true;
    } else {
      where.es_temporada = true;
    }

    const productos = await Producto.findAll({
      where,
      limit: Number(limit),
    });

    return productos.map((p) => {
      const stockDisponible = p.stock_total - p.stock_reservado;

      return {
        ...p.toJSON(),
        stock_disponible: stockDisponible,
        agotado: stockDisponible <= 0,
        disponible: stockDisponible > 0,
      };
    });
  }

  static async listarAdmin() {
    return await Producto.findAll({
      include: [{ model: Categoria, as: "categoria" }],
    });
  }

  static async subirImagen(id, file) {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      throw new AppError("Producto no encontrado", 404);
    }

    if (!file) {
      throw new AppError("Debe subir una imagen", 400);
    }

    const upload = await subirImagenEditorService(file, "productos");

    producto.url_imagen = upload.url;
    await producto.save();

    return producto.url_imagen;
  }

  static async obtenerCaracteristicas(productoId) {
    const producto = await Producto.findByPk(productoId);

    if (!producto) {
      throw new AppError("Producto no encontrado", 404);
    }

    return await ProductoCaracteristica.findAll({
      where: {
        producto_id: productoId,
      },
      include: [
        {
          model: ProductoTab,
          as: "tab",
          attributes: ["id_tab", "nombre", "slug"],
        },
      ],
      order: [
        ["tab_id", "ASC"],
        ["orden", "ASC"],
      ],
    });
  }
}

export default ProductoService;
