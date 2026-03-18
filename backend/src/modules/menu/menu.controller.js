import Menu from "../../modules/menu/menu.model.js";
import logger from "../../shared/logger/logger.js";

/* -----------------------------
   Menu público
----------------------------- */
export const obtenerMenu = async (req, res) => {
  try {
    logger.info({
      message: "Fetching public menu",
    });

    const menu = await Menu.findAll({
      where: { activo: true },
      order: [["orden", "ASC"]],
    });

    return res.json(menu);
  } catch (error) {
    logger.error({
      message: "Error fetching public menu",
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
    logger.info({
      message: "Creating menu item",
      body: req.body,
    });

    const menu = await Menu.create(req.body);

    return res.status(201).json(menu);
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

    await menu.update(req.body);

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
