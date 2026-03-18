import Categoria from "./category.model.js";
import { validationResult } from "express-validator";
import logger from "../../shared/logger/logger.js";
import fs from "fs";
import path from "path";

// 🟢 Crear categoría
export const crearCategoria = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { nombre_categoria, descripcion } = req.body;

    const existe = await Categoria.findOne({ where: { nombre_categoria } });
    if (existe) {
      return res
        .status(400)
        .json({ msg: "Ya existe una categoría con ese nombre" });
    }

    const nueva = await Categoria.create({
      nombre_categoria,
      descripcion,
      url_imagen: req.file ? `categorias/${req.file.filename}` : null,
    });

    logger.info({
      message: "Categoría creada",
      id: nueva.id_categoria,
      nombre: nueva.nombre_categoria,
    });

    res.status(201).json({
      msg: "✅ Categoría creada correctamente",
      categoria: nueva,
    });
  } catch (error) {
    logger.error({
      message: "Error al crear categoría",
      error: error.message,
    });
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// 🟡 Listar categorías
export const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      order: [["id_categoria", "ASC"]],
    });
    res.json(categorias);
  } catch (error) {
    logger.error({
      message: "Error al listar categorías",
      error: error.message,
    });
    res.status(500).json({ msg: "Error al obtener categorías" });
  }
};

// 🔵 Obtener categoría
export const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria)
      return res.status(404).json({ msg: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    logger.error({
      message: "Error al obtener categoría",
      error: error.message,
    });
    res.status(500).json({ msg: "Error al obtener categoría" });
  }
};

// 🟠 Actualizar categoría
export const actualizarCategoria = async (req, res) => {
  try {
    logger.info({
      message: "Actualizar categoría",
      id: req.params.id,
      body: req.body,
    });

    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    logger.debug({
      message: "Estado antes de actualizar categoría",
      categoria: categoria.toJSON(),
    });

    const { nombre_categoria, descripcion } = req.body;

    await categoria.update({
      nombre_categoria,
      descripcion,
    });

    logger.debug({
      message: "Estado después de actualizar categoría",
      categoria: categoria.toJSON(),
    });

    res.json({
      msg: "Categoría actualizada correctamente",
      categoria,
    });
  } catch (error) {
    logger.error({
      message: "Error al actualizar categoría",
      error: error.message,
    });

    res.status(500).json({ msg: "Error al actualizar categoría" });
  }
};

// 🔴 Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria)
      return res.status(404).json({ msg: "Categoría no encontrada" });

    if (categoria.url_imagen) {
      const ruta = path.join("uploads", categoria.url_imagen);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    await categoria.destroy();
    logger.info({
      message: "Categoría eliminada",
      nombre: categoria.nombre_categoria,
    });
    res.json({ msg: "✅ Categoría eliminada correctamente" });
  } catch (error) {
    logger.error({
      message: "Error al eliminar categoría",
      error: error.message,
    });
    res.status(500).json({ msg: "Error al eliminar categoría" });
  }
};

// 🖼️ Subir imagen
export const subirImagenCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria)
      return res.status(404).json({ msg: "Categoría no encontrada" });

    if (!req.file)
      return res.status(400).json({ msg: "No se subió ninguna imagen" });

    // eliminar imagen anterior si existe
    if (categoria.url_imagen) {
      const ruta = path.join("uploads", categoria.url_imagen);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    categoria.url_imagen = `categorias/${req.file.filename}`;

    await categoria.save();

    logger.info({
      message: "Imagen de categoría subida",
      url: categoria.url_imagen,
    });

    res.json({
      msg: "✅ Imagen subida correctamente",
      url_imagen: categoria.url_imagen,
    });
  } catch (error) {
    logger.error({
      message: "Error al subir imagen de categoría",
      error: error.message,
    });
    res.status(500).json({ msg: "Error al subir imagen" });
  }
};
