import Categoria from "../models/Categoria.js";
import { validationResult } from "express-validator";
import chalk from "chalk";
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

    console.log(chalk.green(`✅ Categoría creada: ${nueva.nombre_categoria}`));

    res.status(201).json({
      msg: "✅ Categoría creada correctamente",
      categoria: nueva,
    });
  } catch (error) {
    console.error(chalk.bgRed("❌ Error al crear categoría:"), error);
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
    console.error("❌ Error al listar categorías:", error);
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
    console.error("❌ Error al obtener categoría:", error);
    res.status(500).json({ msg: "Error al obtener categoría" });
  }
};

// 🟠 Actualizar categoría
export const actualizarCategoria = async (req, res) => {
  try {
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.cyan("✏️  ACTUALIZAR CATEGORÍA"));

    console.log(chalk.blue("📥 ID recibido:"), chalk.yellow(req.params.id));

    console.log(
      chalk.blue("📦 BODY recibido:"),
      chalk.yellow(JSON.stringify(req.body, null, 2)),
    );

    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      console.log(chalk.red("❌ Categoría NO encontrada"));
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    console.log(
      chalk.magenta("📌 ANTES de actualizar:"),
      chalk.white(JSON.stringify(categoria.toJSON(), null, 2)),
    );

    const { nombre_categoria, descripcion } = req.body;

    await categoria.update({
      nombre_categoria,
      descripcion,
    });

    console.log(
      chalk.green("✅ DESPUÉS de actualizar:"),
      chalk.white(JSON.stringify(categoria.toJSON(), null, 2)),
    );

    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

    res.json({
      msg: "✅ Categoría actualizada correctamente",
      categoria,
    });
  } catch (error) {
    console.log(chalk.red("💥 ERROR en actualizarCategoria"));
    console.error(chalk.red(error));
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
    console.log(
      chalk.redBright(`🗑️ Categoría eliminada: ${categoria.nombre_categoria}`),
    );
    res.json({ msg: "✅ Categoría eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
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

    console.log(
      chalk.greenBright(
        `🖼️ Imagen subida: http://localhost:3000/uploads/${categoria.url_imagen}`,
      ),
    );

    res.json({
      msg: "✅ Imagen subida correctamente",
      url_imagen: categoria.url_imagen,
    });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    res.status(500).json({ msg: "Error al subir imagen" });
  }
};
