import multer from "multer";
import path from "path";
import fs from "fs";
import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";
import { validationResult } from "express-validator";
import { Op } from "sequelize"; // 👈 arriba del archivo, junto a otros imports
import chalk from "chalk";

// 🧩 Configurar almacenamiento con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 🟢 Crear producto
const crearProducto = async (req, res) => {
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

    if (!administrador_id) {
      return res
        .status(401)
        .json({ msg: "No autorizado: falta administrador_id" });
    }

    const nuevoProducto = await Producto.create({
      nombre_producto,
      descripcion,
      precio,
      stock,
      categoria_id: categoria_id || null,
      marca_id: marca_id || null, // ✅ AGREGADO
      administrador_id,
      url_imagen: "",
    });

    res.status(201).json({
      msg: "✅ Producto creado correctamente",
      producto: nuevoProducto,
    });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// 🟢 Subir imagen (y asociarla al producto)
const subirImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No se subió ninguna imagen" });
    }

    // 🧹 Eliminar imagen anterior si existe
    if (producto.url_imagen) {
      const rutaAnterior = path.join("public", "uploads", producto.url_imagen);
      if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
    }

    producto.url_imagen = req.file.filename;
    await producto.save();

    console.log(
      chalk.greenBright(
        `🖼️ Imagen subida correctamente: http://localhost:3000/uploads/${producto.url_imagen}`
      )
    );

    res.status(200).json({
      msg: "✅ Imagen subida y asociada correctamente",
      url_imagen: producto.url_imagen,
    });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    res.status(500).json({ msg: "Error al subir imagen" });
  }
};

// 🟢 Listar productos para el panel admin
const listarProductosAdmin = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id_categoria", "nombre_categoria"],
        },
      ],
      attributes: [
        "id_producto",
        "nombre_producto",
        "descripcion",
        "precio",
        "stock",
        "url_imagen",
      ],
    });

    res.json(productos);
  } catch (error) {
    console.error("❌ Error al listar productos:", error);
    res.status(500).json({ msg: "Error al obtener productos" });
  }
};

// 🟢 Listar productos públicos (para la web)
const listarProductosPublicos = async (req, res) => {
  try {
    const { search, marca, categoria } = req.query;

    const where = {};

    // 🔍 BÚSQUEDA POR NOMBRE O DESCRIPCIÓN
    if (search) {
      where[Op.or] = [
        { nombre_producto: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filtro por marca y categoría
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
      ],
    });

    res.json(productos);
  } catch (error) {
    console.error("❌ Error al listar productos públicos:", error);
    res.status(500).json({ msg: "Error al obtener productos públicos" });
  }
};

const listarProductosPorPrecio = async (req, res) => {
  try {
    const { min, max } = req.query;

    const where = {};

    // Convertimos de forma segura
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
      ],
    });

    res.json(productos);
    console.log(
      chalk.cyan(`📦 Productos por precio devueltos: ${productos.length}`)
    );
  } catch (error) {
    console.error("❌ Error al filtrar productos por precio:", error);
    res.status(500).json({ msg: "Error al filtrar productos por precio" });
  }
};

// 🟢 Obtener un solo producto
const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["nombre_categoria"],
        },
      ],
    });

    if (!producto)
      return res.status(404).json({ msg: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).json({ msg: "Error al obtener producto" });
  }
};

// 🟢 Actualizar producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto)
      return res.status(404).json({ msg: "Producto no encontrado" });

    await producto.update(req.body);
    res.json({ msg: "✅ Producto actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ msg: "Error al actualizar producto" });
  }
};

// 🟢 Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto)
      return res.status(404).json({ msg: "Producto no encontrado" });

    // 🧹 Eliminar imagen si existe
    if (producto.url_imagen) {
      const rutaImagen = path.join("public", "uploads", producto.url_imagen);
      if (fs.existsSync(rutaImagen)) fs.unlinkSync(rutaImagen);
    }

    await producto.destroy();
    res.json({ msg: "🗑️ Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ msg: "Error al eliminar producto" });
  }
};

export {
  crearProducto,
  listarProductosAdmin,
  listarProductosPublicos,
  listarProductosPorPrecio,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagen,
};
