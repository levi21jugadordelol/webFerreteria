import Pagina from "../../modules/pages/pagina.model.js";
import chalk from "chalk";

/* -----------------------------
   Crear página
----------------------------- */
export const crearPagina = async (req, res) => {
  console.log(chalk.blue("📥 [PAGINA] crearPagina"), req.body);

  try {
    let { titulo, slug, contenido } = req.body;

    if (!titulo || !slug || !contenido) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios",
      });
    }

    slug = slug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existe = await Pagina.findOne({ where: { slug } });

    if (existe) {
      return res.status(400).json({
        msg: "Ya existe una página con ese slug",
      });
    }

    const pagina = await Pagina.create({
      titulo,
      slug,
      contenido,
      activo: true,
    });

    console.log(chalk.green("✅ Página creada:"), chalk.yellow(pagina.slug));

    res.status(201).json(pagina);
  } catch (error) {
    console.log(chalk.red("❌ Error crearPagina"), error);

    res.status(500).json({
      msg: "Error al crear página",
    });
  }
};

/* -----------------------------
   Listar páginas ADMIN
----------------------------- */
export const listarPaginasAdmin = async (req, res) => {
  console.log(chalk.blue("📄 [PAGINA] listarPaginasAdmin"));

  try {
    const paginas = await Pagina.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(paginas);
  } catch (error) {
    console.log(chalk.red("❌ Error listarPaginasAdmin"), error);

    res.status(500).json({
      msg: "Error al listar páginas",
    });
  }
};

/* -----------------------------
   Obtener página pública
----------------------------- */
export const obtenerPagina = async (req, res) => {
  const { slug } = req.params;

  console.log(chalk.blue("📄 Buscando página:"), slug);

  try {
    const pagina = await Pagina.findOne({
      where: { slug, activo: true },
    });

    if (!pagina) {
      return res.status(404).json({
        msg: "Página no encontrada",
      });
    }

    res.json(pagina);
  } catch (error) {
    console.log(chalk.red("❌ Error obtenerPagina"), error);

    res.status(500).json({
      msg: "Error al obtener página",
    });
  }
};

/* -----------------------------
   Obtener página ADMIN
----------------------------- */
export const obtenerPaginaAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const pagina = await Pagina.findByPk(id);

    if (!pagina) {
      return res.status(404).json({
        msg: "Página no encontrada",
      });
    }

    res.json(pagina);
  } catch (error) {
    res.status(500).json({
      msg: "Error al obtener página",
    });
  }
};

/* -----------------------------
   Actualizar página
----------------------------- */
export const actualizarPagina = async (req, res) => {
  const { id } = req.params;

  console.log(chalk.yellow("✏️ Actualizando página"), id);

  try {
    const pagina = await Pagina.findByPk(id);

    if (!pagina) {
      return res.status(404).json({
        msg: "Página no encontrada",
      });
    }

    await pagina.update(req.body);

    res.json({
      msg: "Página actualizada",
    });
  } catch (error) {
    console.log(chalk.red("❌ Error actualizarPagina"), error);

    res.status(500).json({
      msg: "Error al actualizar página",
    });
  }
};

/* -----------------------------
   Listar páginas públicas
----------------------------- */
export const listarPaginas = async (req, res) => {
  console.log(chalk.blue("📄 [PAGINA] listarPaginas"));

  try {
    const paginas = await Pagina.findAll({
      where: { activo: true },
      attributes: ["titulo", "slug"],
      order: [["titulo", "ASC"]],
    });

    res.json(paginas);
  } catch (error) {
    console.log(chalk.red("❌ Error listarPaginas"), error);

    res.status(500).json({
      msg: "Error al listar páginas",
    });
  }
};

/* -----------------------------
   Eliminar página
----------------------------- */
export const eliminarPagina = async (req, res) => {
  const { id } = req.params;

  console.log(chalk.red("🗑️ Eliminando página"), id);

  try {
    const pagina = await Pagina.findByPk(id);

    if (!pagina) {
      return res.status(404).json({
        msg: "Página no encontrada",
      });
    }

    await pagina.destroy();

    res.json({
      msg: "Página eliminada",
    });
  } catch (error) {
    console.log(chalk.red("❌ Error eliminarPagina"), error);

    res.status(500).json({
      msg: "Error al eliminar página",
    });
  }
};
