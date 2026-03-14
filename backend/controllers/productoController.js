import multer from "multer";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import chalk from "chalk";

import Producto from "../models/Producto.js";
import Categoria from "../src/modules/categories/category.model.js";
import ProductoImagen from "../models/ProductoImagen.js";
import ProductoCaracteristica from "../models/ProductoCaracteristica.js";
import ProductoTab from "../src/modules/productoTab/productoTab.model.js";

import { validationResult } from "express-validator";

import ProductoService from "../services/ProductoService.js";

import { getSiteSettings } from "../src/modules/settings/settings.services.js";

/* -----------------------------
   Multer
----------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/productos");
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* -----------------------------
   Crear Producto
----------------------------- */
export const crearProducto = async (req, res) => {
  console.log(chalk.bgYellow.black("🚨 crearProducto INVOCADO"));

  console.log("🟡 req.file =>", req.file);
  console.log("🟡 req.body =>", req.body);

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const {
      nombre_producto,
      descripcion,
      precio,
      stock,
      categoria_id,
      marca_id,
      es_destacado,
      es_temporada,
      temporada_inicio,
      temporada_fin,
    } = req.body;

    const administrador_id = req.admin?.id_administrador;
    if (!administrador_id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // 🔴 Validaciones básicas
    if (!nombre_producto || nombre_producto.trim().length < 3) {
      return res.status(400).json({ msg: "Nombre de producto inválido" });
    }

    if (!categoria_id || !marca_id) {
      return res
        .status(400)
        .json({ msg: "Categoría y marca son obligatorias" });
    }

    if (Number(stock) < 0 || Number(precio) <= 0) {
      return res.status(400).json({ msg: "Precio o stock inválido" });
    }

    if (es_temporada && (!temporada_inicio || !temporada_fin)) {
      return res.status(400).json({
        msg: "Los productos de temporada requieren fechas de inicio y fin",
      });
    }

    // 🔴 Validación de duplicado (CLAVE)
    const existe = await Producto.findOne({
      where: {
        nombre_producto,
        marca_id,
      },
    });

    if (existe) {
      return res.status(400).json({
        msg: "Ya existe un producto con ese nombre para esta marca",
      });
    }

    // 🔴 Validación de imagen
    if (req.file) {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({
          msg: "Formato de imagen no permitido",
        });
      }
    }

    const imagen = req.file ? `productos/${req.file.filename}` : null;

    const producto = await Producto.create({
      nombre_producto,
      descripcion,
      precio,
      stock,
      categoria_id,
      marca_id,
      administrador_id,
      url_imagen: imagen,
      es_destacado: !!es_destacado,
      es_temporada: !!es_temporada,
      temporada_inicio: temporada_inicio || null,
      temporada_fin: temporada_fin || null,
    });

    res.status(201).json({
      msg: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    console.error("❌ Error crearProducto:", error);
    res.status(500).json({ msg: "Error al crear producto" });
  }
};

/* -----------------------------
   Subir imagen principal
----------------------------- */
export const subirImagen = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto)
      return res.status(404).json({ msg: "Producto no encontrado" });

    if (!req.file)
      return res.status(400).json({ msg: "Debe subir una imagen" });

    // borrar anterior
    if (producto.url_imagen) {
      const ruta = path.join("uploads", producto.url_imagen);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    producto.url_imagen = `productos/${req.file.filename}`;
    await producto.save();

    res.json({ msg: "Imagen actualizada", url_imagen: producto.url_imagen });
  } catch (error) {
    res.status(500).json({ msg: "Error al subir imagen" });
  }
};

/* -----------------------------
   Subir imagen adicional
----------------------------- */
export const subirImagenExtra = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ msg: "No se subió imagen" });
    }

    const nueva = await ProductoImagen.create({
      producto_id: id,
      url: `productos/${req.file.filename}`, // ✅ AQUÍ ESTÁ EL FIX REAL
    });

    res.json({ msg: "Imagen guardada", imagen: nueva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al guardar imagen extra" });
  }
};

/* -----------------------------
   Eliminar imagen extra
----------------------------- */
export const eliminarImagenExtra = async (req, res) => {
  try {
    const { idImg } = req.params;

    const imagen = await ProductoImagen.findByPk(idImg);
    if (!imagen) return res.status(404).json({ msg: "No encontrada" });

    const ruta = path.join("uploads", imagen.url); // ✅

    if (fs.existsSync(ruta)) fs.unlinkSync(ruta);

    await imagen.destroy();

    res.json({ msg: "Imagen eliminada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar imagen" });
  }
};

/* -----------------------------
   Agregar característica
----------------------------- */
export const agregarCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, valor, tab_id, orden } = req.body;

    if (!titulo || !valor) {
      return res.status(400).json({ msg: "Datos incompletos" });
    }

    const nueva = await ProductoCaracteristica.create({
      producto_id: id,
      titulo,
      valor,
      tab_id,
      orden: orden || 0,
    });

    res.json({
      msg: "Característica agregada",
      caracteristica: nueva,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al agregar característica" });
  }
};

/* -----------------------------
   Editar característica
----------------------------- */

export const actualizarCaracteristica = async (req, res) => {
  try {
    const { idCarac } = req.params;
    const { titulo, valor, tab_id, orden } = req.body;

    const carac = await ProductoCaracteristica.findByPk(idCarac);

    if (!carac) {
      return res.status(404).json({
        msg: "Característica no encontrada",
      });
    }

    await carac.update({
      titulo,
      valor,
      tab_id,
      orden,
    });

    res.json({
      msg: "Característica actualizada",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al actualizar característica",
    });
  }
};

/* -----------------------------
   Eliminar característica
----------------------------- */
export const eliminarCaracteristica = async (req, res) => {
  try {
    const { idCarac } = req.params;

    const carac = await ProductoCaracteristica.findByPk(idCarac);
    if (!carac) return res.status(404).json({ msg: "No encontrada" });

    await carac.destroy();

    res.json({ msg: "Característica eliminada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar característica" });
  }
};

/* -----------------------------
   Listar productos públicos
----------------------------- */
export const listarProductosPublicos = async (req, res) => {
  try {
    const productos = await ProductoService.listarPublicos(req.query);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/* -----------------------------
   Obtener producto
----------------------------- */
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await ProductoService.obtenerPorId(req.params.id);
    res.json(producto);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

/* -----------------------------
   Productos relacionados
----------------------------- */
export const productosRelacionados = async (req, res) => {
  try {
    const { id } = req.params;

    const prod = await Producto.findByPk(id);
    if (!prod) return res.status(404).json({ msg: "No existe" });

    const relacionados = await Producto.findAll({
      where: {
        categoria_id: prod.categoria_id,
        id_producto: { [Op.ne]: id },
      },
      limit: 6,
    });

    res.json(relacionados);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener relacionados" });
  }
};

/* -----------------------------
   Listar admin
----------------------------- */
export const listarProductosAdmin = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [{ model: Categoria, as: "categoria" }],
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error admin productos" });
  }
};

/* -----------------------------
   Actualizar
----------------------------- */
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) return res.status(404).json({ msg: "No encontrado" });

    await producto.update(req.body);

    res.json({ msg: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar" });
  }
};

/* -----------------------------
   Eliminar
----------------------------- */
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) return res.status(404).json({ msg: "No encontrado" });

    // borrar imagen principal
    if (producto.url_imagen) {
      const ruta = path.join("uploads", producto.url_imagen);

      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    // borrar imágenes extra
    const extras = await ProductoImagen.findAll({
      where: { producto_id: producto.id_producto },
    });

    for (const img of extras) {
      const ruta = path.join("uploads", img.url);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      await img.destroy();
    }

    // borrar características
    await ProductoCaracteristica.destroy({
      where: { producto_id: producto.id_producto },
    });

    await producto.destroy();

    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar" });
  }
};

/* -----------------------------
   Productos HOME (temporada / destacados)
----------------------------- */
export const listarProductosHome = async (req, res) => {
  try {
    const { tipo, limit } = req.query; // tipo=temporada | destacados
    const productos = await ProductoService.listarHome({ tipo, limit });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const obtenerProductoCompleto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await ProductoService.obtenerPorId(id);

    if (!producto) {
      return res.status(404).json({
        msg: "Producto no encontrado",
      });
    }

    const relacionados = await Producto.findAll({
      where: {
        categoria_id: producto.categoria_id,
        id_producto: { [Op.ne]: id },
      },
      limit: 6,
    });

    const settings = await getSiteSettings();

    res.json({
      producto,
      relacionados,
      settings,
    });
  } catch (error) {
    console.error("❌ Error obtenerProductoCompleto", error);

    res.status(500).json({
      msg: "Error al cargar producto",
    });
  }
};

/* -----------------------------
   Obtener características de un producto
----------------------------- */
export const obtenerCaracteristicas = async (req, res) => {
  try {
    const { id } = req.params;

    const caracteristicas = await ProductoCaracteristica.findAll({
      where: { producto_id: id },

      include: [
        {
          model: ProductoTab,
          as: "tab",
          attributes: ["id_tab", "nombre"],
        },
      ],

      order: [["orden", "ASC"]],
    });

    res.json(caracteristicas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      msg: "Error al obtener características",
    });
  }
};
