import ProductoTab from "./productoTab.model.js";

/* ===============================
   LISTAR TABS
================================ */
export const listarTabs = async (req, res) => {
  try {
    const tabs = await ProductoTab.findAll({
      order: [
        ["orden", "ASC"],
        ["id_tab", "ASC"],
      ],
    });

    res.json(tabs);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar tabs" });
  }
};

/* ===============================
   CREAR TAB
================================ */
export const crearTab = async (req, res) => {
  try {
    let { nombre, slug, orden } = req.body;

    if (!nombre) {
      return res.status(400).json({
        msg: "Nombre es obligatorio",
      });
    }

    /* ======================
       GENERAR SLUG SI NO EXISTE
    ====================== */

    if (!slug) {
      slug = generarSlug(nombre);
    }

    /* ======================
       EVITAR DUPLICADOS
    ====================== */

    const existe = await ProductoTab.findOne({
      where: { slug },
    });

    if (existe) {
      return res.status(400).json({
        msg: "El slug ya existe",
      });
    }

    /* ======================
       CREAR TAB
    ====================== */

    const nueva = await ProductoTab.create({
      nombre,
      slug,
      orden: orden || 0,
      activo: true,
    });

    res.json({
      msg: "Tab creada",
      tab: nueva,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
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

    res.json({
      msg: "Tab actualizada",
    });
  } catch (error) {
    res.status(500).json({
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

    const tab = await ProductoTab.findByPk(id);

    if (!tab) {
      return res.status(404).json({
        msg: "Tab no encontrada",
      });
    }

    tab.activo = !tab.activo;

    await tab.save();

    res.json({
      msg: "Estado actualizado",
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al cambiar estado" });
  }
};

/* ===============================
   ELIMINAR
================================ */
export const eliminarTab = async (req, res) => {
  try {
    const { id } = req.params;

    const tab = await ProductoTab.findByPk(id);

    if (!tab) {
      return res.status(404).json({
        msg: "Tab no encontrada",
      });
    }

    await tab.destroy();

    res.json({
      msg: "Tab eliminada",
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar tab" });
  }
};
