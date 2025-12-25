import multer from "multer";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";
import ProductoImagen from "../models/ProductoImagen.js";
import ProductoCaracteristica from "../models/ProductoCaracteristica.js";

import { validationResult } from "express-validator";
import chalk from "chalk";
import ProductoService from "../services/ProductoService.js";

/* -----------------------------
   Multer
----------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* -----------------------------
   Crear Producto
----------------------------- */
export const crearProducto = async (req, res) => {
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
    } = req.body;

    const administrador_id = req.admin?.id_administrador;
    if (!administrador_id)
      return res.status(401).json({ msg: "No autorizado" });

    const nuevo = await Producto.create({
      nombre_producto,
      descripcion,
      precio,
      stock,
      categoria_id: categoria_id || null,
      marca_id: marca_id || null,
      administrador_id,
      url_imagen: "",
    });

    res.status(201).json({ msg: "Producto creado", producto: nuevo });
  } catch (error) {
    console.error(error);
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
      const ruta = path.join("public/uploads", producto.url_imagen);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    producto.url_imagen = req.file.filename;
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

    if (!req.file) return res.status(400).json({ msg: "No se subió imagen" });

    const nueva = await ProductoImagen.create({
      producto_id: id,
      url: req.file.filename,
    });

    res.json({ msg: "Imagen guardada", imagen: nueva });
  } catch (error) {
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

    const ruta = path.join("public/uploads", imagen.url);
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
    const { titulo, valor } = req.body;

    if (!titulo || !valor)
      return res.status(400).json({ msg: "Datos incompletos" });

    const nueva = await ProductoCaracteristica.create({
      producto_id: id,
      titulo,
      valor,
    });

    res.json({ msg: "Característica agregada", caracteristica: nueva });
  } catch (error) {
    res.status(500).json({ msg: "Error al agregar característica" });
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
      const ruta = path.join("public/uploads", producto.url_imagen);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    // borrar imágenes extra
    const extras = await ProductoImagen.findAll({
      where: { producto_id: producto.id_producto },
    });

    for (const img of extras) {
      const ruta = path.join("public/uploads", img.url);
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
