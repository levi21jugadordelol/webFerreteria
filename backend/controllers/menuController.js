import Menu from "../models/Menu.js";
import chalk from "chalk";

/* -----------------------------
   Menu público
----------------------------- */
export const obtenerMenu = async (req, res) => {
  const menu = await Menu.findAll({
    where: { activo: true },
    order: [["orden", "ASC"]],
  });

  res.json(menu);
};

/* -----------------------------
   Listar menu ADMIN
----------------------------- */
export const listarMenuAdmin = async (req, res) => {
  console.log(chalk.blue("📄 Listando menu admin"));

  const menu = await Menu.findAll({
    order: [["orden", "ASC"]],
  });

  res.json(menu);
};

/* -----------------------------
   Crear enlace menu
----------------------------- */
export const crearMenu = async (req, res) => {
  console.log(chalk.blue("📥 Crear menu"), req.body);

  try {
    const menu = await Menu.create(req.body);

    res.status(201).json(menu);
  } catch (error) {
    console.log(chalk.red("❌ Error crearMenu"), error);

    res.status(500).json({
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
    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({
        msg: "Enlace no encontrado",
      });
    }

    await menu.update(req.body);

    res.json({
      msg: "Enlace actualizado",
    });
  } catch (error) {
    res.status(500).json({
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
    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({
        msg: "Enlace no encontrado",
      });
    }

    await menu.destroy();

    res.json({
      msg: "Enlace eliminado",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al eliminar",
    });
  }
};
