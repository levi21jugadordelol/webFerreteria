import Pagina from "../../modules/pages/pagina.model.js";
import logger from "../../shared/logger/logger.js";

/* -----------------------------
   Crear página
----------------------------- */
export const crearPagina = async (req, res) => {
  try {
    logger.info({
      message: "Creating page",
      body: req.body,
    });

    let {
      titulo,
      slug,
      contenido,
      template,
      imagen_portada,
      meta_description,
    } = req.body;

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

    if (template !== "default" && !imagen_portada) {
      return res.status(400).json({
        msg: "Este template requiere imagen",
      });
    }

    const pagina = await Pagina.create({
      titulo,
      slug,
      contenido,
      template: template || "default",
      imagen_portada,
      meta_description,
      activo: true,
    });

    logger.info({
      message: "Page created",
      slug: pagina.slug,
    });

    return res.status(201).json(pagina);
  } catch (error) {
    logger.error({
      message: "Error creating page",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al crear página",
    });
  }
};

/* -----------------------------
   Listar páginas ADMIN
----------------------------- */
export const listarPaginasAdmin = async (req, res) => {
  try {
    logger.info({
      message: "Fetching admin pages",
    });

    const paginas = await Pagina.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json(paginas);
  } catch (error) {
    logger.error({
      message: "Error listing admin pages",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al listar páginas",
      error: error.message,
    });
  }
};

/* -----------------------------
   Obtener página pública
----------------------------- */
export const obtenerPagina = async (req, res) => {
  const { slug } = req.params;

  try {
    logger.info({
      message: "Fetching public page",
      slug,
    });

    const pagina = await Pagina.findOne({
      where: { slug, activo: true },
    });

    if (!pagina) {
      return res.status(404).json({
        msg: "Página no encontrada",
      });
    }

    return res.json(pagina);
  } catch (error) {
    logger.error({
      message: "Error fetching public page",
      error: error.message,
    });

    return res.status(500).json({
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

    return res.json(pagina);
  } catch (error) {
    logger.error({
      message: "Error fetching page by id (admin)",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al obtener página",
    });
  }
};

/* -----------------------------
   Actualizar página
----------------------------- */
export const actualizarPagina = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info({
      message: "Updating page",
      id,
      body: req.body,
    });

    const pagina = await Pagina.findByPk(id);

    if (!pagina) {
      return res.status(404).json({
        msg: "Página no encontrada",
      });
    }

    await pagina.update(req.body);

    return res.json({
      msg: "Página actualizada",
    });
  } catch (error) {
    logger.error({
      message: "Error updating page",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al actualizar página",
    });
  }
};

/* -----------------------------
   Listar páginas públicas
----------------------------- */
export const listarPaginas = async (req, res) => {
  try {
    logger.info({
      message: "Fetching public pages list",
    });

    const paginas = await Pagina.findAll({
      where: { activo: true },
      attributes: ["titulo", "slug"],
      order: [["titulo", "ASC"]],
    });

    return res.json(paginas);
  } catch (error) {
    logger.error({
      message: "Error listing public pages",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al listar páginas",
      error: error.message,
    });
  }
};

/* -----------------------------
   Eliminar página
----------------------------- */
export const eliminarPagina = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info({
      message: "Deleting page",
      id,
    });

    const pagina = await Pagina.findByPk(id);

    if (!pagina) {
      return res.status(404).json({
        msg: "Página no encontrada",
      });
    }

    await pagina.destroy();

    return res.json({
      msg: "Página eliminada",
    });
  } catch (error) {
    logger.error({
      message: "Error deleting page",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al eliminar página",
    });
  }
};
