import ProductoTab from "./productoTab.model.js";
import logger from "../../shared/logger/logger.js";
import { generarSlugUnico } from "../../shared/helpers/generarSlug.js";

/* ===============================
   LISTAR TABS
================================ */
export const listarTabs = async (req, res) => {
  try {
    logger.info({
      message: "Fetching product tabs",
    });

    const tabs = await ProductoTab.findAll({
      order: [
        ["orden", "ASC"],
        ["id_tab", "ASC"],
      ],
    });

    return res.json(tabs);
  } catch (error) {
    logger.error({
      message: "Error listing product tabs",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al listar tabs" });
  }
};

/* ===============================
   CREAR TAB
================================ */
export const crearTab = async (req, res) => {
  try {
    let { nombre, slug, orden } = req.body;

    logger.info({
      message: "Creating product tab",
      body: req.body,
    });

    if (!nombre) {
      return res.status(400).json({
        msg: "Nombre es obligatorio",
      });
    }

    if (!slug) {
      slug = await generarSlugUnico(nombre);
    }

    const existe = await ProductoTab.findOne({
      where: { slug },
    });

    if (existe) {
      return res.status(400).json({
        msg: "El slug ya existe",
      });
    }

    const nueva = await ProductoTab.create({
      nombre,
      slug,
      orden: orden || 0,
      activo: true,
    });

    logger.info({
      message: "Product tab created",
      id: nueva.id_tab,
    });

    return res.json({
      msg: "Tab creada",
      tab: nueva,
    });
  } catch (error) {
    logger.error({
      message: "Error creating product tab",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al crear tab",
    });
  }
};

/* ===============================
   ACTUALIZAR TAB
================================ */
export const actualizarTab = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, slug, orden } = req.body;

    logger.info({
      message: "Updating product tab",
      id,
      body: req.body,
    });

    const tab = await ProductoTab.findByPk(id);

    if (!tab) {
      return res.status(404).json({
        msg: "Tab no encontrada",
      });
    }

    await tab.update({
      nombre,
      slug,
      orden,
    });

    return res.json({
      msg: "Tab actualizada",
    });
  } catch (error) {
    logger.error({
      message: "Error updating product tab",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al actualizar tab",
    });
  }
};

/* ===============================
   ACTIVAR / DESACTIVAR
================================ */
export const toggleTab = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info({
      message: "Toggling product tab",
      id,
    });

    const tab = await ProductoTab.findByPk(id);

    if (!tab) {
      return res.status(404).json({
        msg: "Tab no encontrada",
      });
    }

    tab.activo = !tab.activo;
    await tab.save();

    return res.json({
      msg: "Estado actualizado",
    });
  } catch (error) {
    logger.error({
      message: "Error toggling product tab",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al cambiar estado" });
  }
};

/* ===============================
   ELIMINAR
================================ */
export const eliminarTab = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info({
      message: "Deleting product tab",
      id,
    });

    const tab = await ProductoTab.findByPk(id);

    if (!tab) {
      return res.status(404).json({
        msg: "Tab no encontrada",
      });
    }

    await tab.destroy();

    return res.json({
      msg: "Tab eliminada",
    });
  } catch (error) {
    logger.error({
      message: "Error deleting product tab",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al eliminar tab" });
  }
};
