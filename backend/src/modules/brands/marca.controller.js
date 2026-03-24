// controllers/marcaController.js
import Marca from "../../modules/brands/marca.model.js";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import logger from "../../shared/logger/logger.js";

// 🟢 Crear marca
export const crearMarca = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty())
    return res.status(400).json({ errores: errores.array() });

  try {
    const { nombre_marca, descripcion } = req.body;

    const existe = await Marca.findOne({ where: { nombre_marca } });
    if (existe)
      return res
        .status(400)
        .json({ msg: "Ya existe una marca con ese nombre" });

    const nueva = await Marca.create({
      nombre_marca,
      descripcion,
    });

    logger.info({
      message: "Marca creada",
      nombre: nueva.nombre_marca,
      id: nueva.id_marca,
    });

    res.status(201).json({
      msg: "Marca creada correctamente",
      marca: nueva,
    });
  } catch (error) {
    logger.error({
      message: "Error al crear marca",
      error: error.message,
    });
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// 🔵 Listar marcas
export const listarMarcas = async (req, res) => {
  try {
    const marcas = await Marca.findAll({
      order: [["id_marca", "ASC"]],
    });
    res.json(marcas);
  } catch (err) {
    logger.error({
      message: "Error al listar marcas",
      error: err.message,
    });
    res.status(500).json({ msg: "Error al obtener marcas" });
  }
};

// 🔵 Obtener una marca
export const obtenerMarca = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id);
    if (!marca) return res.status(404).json({ msg: "Marca no encontrada" });
    res.json(marca);
  } catch (err) {
    logger.error({
      message: "Error al obtener marca",
      error: err.message,
    });
    res.status(500).json({ msg: "Error al obtener marca" });
  }
};

// ✏️ Actualizar
export const actualizarMarca = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id);
    if (!marca) return res.status(404).json({ msg: "Marca no encontrada" });

    await marca.update(req.body);
    res.json({ msg: "Marca actualizada correctamente", marca });
  } catch (err) {
    logger.error({
      message: "Error al actualizar marca",
      error: err.message,
    });
    res.status(500).json({ msg: "Error al actualizar marca" });
  }
};

// 🗑️ Eliminar
export const eliminarMarca = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id);
    if (!marca) return res.status(404).json({ msg: "Marca no encontrada" });

    if (marca.url_logo) {
      const ruta = path.join("uploads", marca.url_logo);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    await marca.destroy();
    res.json({ msg: "Marca eliminada correctamente" });
  } catch (err) {
    logger.error({
      message: "Error al eliminar marca",
      error: err.message,
    });
    res.status(500).json({ msg: "Error al eliminar marca" });
  }
};

// 🖼️ Subir logo
export const subirLogoMarca = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id);
    if (!marca) return res.status(404).json({ msg: "Marca no encontrada" });

    if (!req.file)
      return res.status(400).json({ msg: "No se subió ningún logo" });

    // eliminar logo anterior
    if (marca.url_logo) {
      const ruta = path.join("uploads", marca.url_logo);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    marca.url_logo = `marcas/${req.file.filename}`;

    await marca.save();

    res.json({
      msg: "Logo de marca subido correctamente",
      url_logo: marca.url_logo,
    });
  } catch (err) {
    logger.error({
      message: "Error al subir logo de marca",
      error: err.message,
    });
    res.status(500).json({ msg: "Error al subir logo" });
  }
};
