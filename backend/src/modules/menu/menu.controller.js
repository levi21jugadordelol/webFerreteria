import Menu from "../../modules/menu/menu.model.js";
import logger from "../../shared/logger/logger.js";

/* -----------------------------
   Menu público
----------------------------- */
export const obtenerMenu = async (req, res) => {
  try {
    const items = await Menu.findAll({
      where: { activo: true },
      order: [["orden", "ASC"]],
      raw: true,
    });

    // 🔥 convertir a árbol
    const mapa = {};
    const menu = [];

    items.forEach((item) => {
      item.children = [];
      mapa[item.id_menu] = item;
    });

    items.forEach((item) => {
      if (item.parent_id) {
        mapa[item.parent_id]?.children.push(item);
      } else {
        menu.push(item);
      }
    });

    return res.json(menu);
  } catch (error) {
    logger.error({
      message: "Error fetching menu",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al obtener menú",
    });
  }
};

/* -----------------------------
   Listar menu ADMIN
----------------------------- */
export const listarMenuAdmin = async (req, res) => {
  try {
    logger.info({
      message: "Fetching admin menu",
    });

    const menu = await Menu.findAll({
      order: [["orden", "ASC"]],
    });

    return res.json(menu);
  } catch (error) {
    logger.error({
      message: "Error fetching admin menu",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al listar menú",
    });
  }
};

/* -----------------------------
   Crear enlace menu
----------------------------- */
export const crearMenu = async (req, res) => {
  try {
    const { titulo, tipo, url, orden, activo, parent_id } = req.body;

    logger.info({
      message: "Creating menu item",
      body: req.body,
    });

    /* -----------------------------
       VALIDACIONES
    ----------------------------- */

    if (!titulo || !tipo || !url) {
      return res.status(400).json({
        msg: "Título, tipo y url son obligatorios",
      });
    }

    if (!["pagina", "ruta"].includes(tipo)) {
      return res.status(400).json({
        msg: "Tipo inválido (pagina | ruta)",
      });
    }

    // 🔹 Validación por tipo
    if (tipo === "ruta" && !url.startsWith("/")) {
      return res.status(400).json({
        msg: "La ruta debe empezar con '/'",
      });
    }

    const nuevoMenu = await Menu.create({
      titulo,
      tipo,
      url,
      orden: Number(orden || 0),
      activo: activo ? 1 : 0,
      parent_id: parent_id || null,
    });

    return res.status(201).json(nuevoMenu);
  } catch (error) {
    logger.error({
      message: "Error creating menu",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al crear enlace",
    });
  }
};

/* -----------------------------
   Actualizar menu
----------------------------- */
export const actualizarMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const { titulo, tipo, url, orden, activo } = req.body;

    logger.info({
      message: "Updating menu item",
      id,
      body: req.body,
    });

    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({
        msg: "Enlace no encontrado",
      });
    }

    /* -----------------------------
       VALIDACIONES
    ----------------------------- */

    if (!titulo || !tipo || !url) {
      return res.status(400).json({
        msg: "Título, tipo y url son obligatorios",
      });
    }

    if (!["pagina", "ruta"].includes(tipo)) {
      return res.status(400).json({
        msg: "Tipo inválido",
      });
    }

    if (tipo === "ruta" && !url.startsWith("/")) {
      return res.status(400).json({
        msg: "La ruta debe empezar con '/'",
      });
    }

    await menu.update({
      titulo,
      tipo,
      url,
      orden: Number(orden || 0),
      activo: activo ? 1 : 0,
    });

    return res.json({
      msg: "Enlace actualizado",
    });
  } catch (error) {
    logger.error({
      message: "Error updating menu",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al actualizar",
    });
  }
};

/* -----------------------------
   Eliminar menu
----------------------------- */
export const eliminarMenu = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info({
      message: "Deleting menu item",
      id,
    });

    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({
        msg: "Enlace no encontrado",
      });
    }

    await menu.destroy();

    return res.json({
      msg: "Enlace eliminado",
    });
  } catch (error) {
    logger.error({
      message: "Error deleting menu",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al eliminar",
    });
  }
};

export const actualizarOrdenMenu = async (req, res) => {
  try {
    const { menus } = req.body;

    if (!menus || !Array.isArray(menus)) {
      return res.status(400).json({
        msg: "Datos inválidos",
      });
    }

    for (const item of menus) {
      await Menu.update(
        { orden: item.orden },
        { where: { id_menu: item.id_menu } },
      );
    }

    return res.json({
      msg: "Orden actualizado",
    });
  } catch (error) {
    logger.error({
      message: "Error updating menu order",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al actualizar orden",
    });
  }
};

export const obtenerMenuPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const menu = await Menu.findByPk(id, { raw: true });

    if (!menu) {
      return res.status(404).json({
        msg: "Enlace no encontrado",
      });
    }

    return res.json(menu);
  } catch (error) {
    logger.error({
      message: "Error fetching menu by id",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al obtener enlace",
    });
  }
};
