import HeroSlide from "./hero.model.js";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import logger from "../../shared/logger/logger.js";

/* ──────────────────────────────
   🟢 GET PUBLICO
────────────────────────────── */
export const getHeroSlides = async (req, res) => {
  try {
    const { type } = req.query;

    logger.info({
      message: "Fetching hero slides",
      type: type || "all",
    });

    let where = { activo: true };

    if (type === "carousel") {
      where.tipo_layout = {
        [Op.in]: ["banner", "text-left", "text-right", "centered"],
      };
    }

    if (type === "triple") {
      where.tipo_layout = "triple";
    }

    const slides = await HeroSlide.findAll({
      where,
      order: [["orden", "ASC"]],
    });

    return res.json(slides);
  } catch (error) {
    logger.error({
      message: "Error fetching hero slides",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al obtener hero slides" });
  }
};

/* ──────────────────────────────
   🟢 GET POR ID
────────────────────────────── */
export const getHeroById = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await HeroSlide.findByPk(id);

    if (!slide) {
      return res.status(404).json({
        msg: "Hero slide no encontrado",
      });
    }

    return res.json(slide);
  } catch (error) {
    logger.error({
      message: "Error fetching hero by id",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al obtener hero slide",
    });
  }
};

/* ──────────────────────────────
   🔒 CREAR SLIDE
────────────────────────────── */
export const createHeroSlide = async (req, res) => {
  try {
    logger.info({
      message: "Creating hero slide",
      body: req.body,
    });

    const {
      titulo1,
      titulo2,
      orden,
      tipo_layout,
      boton_texto,
      boton_url,
      link_url,
    } = req.body;

    let url = boton_url;
    if (Array.isArray(url)) url = url[0];

    const activo = req.body.activo === "on";
    const mostrar_boton = req.body.mostrar_boton === "on";

    if (!req.file) {
      return res.status(400).json({ msg: "Debe subir una imagen" });
    }

    if (tipo_layout === "triple") {
      const totalTriple = await HeroSlide.count({
        where: { tipo_layout: "triple" },
      });

      if (totalTriple >= 3) {
        return res.status(400).json({
          msg: "Solo se permiten máximo 3 banners promocionales",
        });
      }
    }

    if (tipo_layout !== "banner" && tipo_layout !== "triple") {
      if (!titulo1 && !titulo2) {
        return res.status(400).json({
          msg: "Este layout requiere texto",
        });
      }
    }

    if (mostrar_boton) {
      if (!boton_texto || !url) {
        return res.status(400).json({
          msg: "Debe completar texto y URL del botón",
        });
      }
    }

    const slide = await HeroSlide.create({
      titulo1: titulo1 || null,
      titulo2: titulo2 || null,
      imagen: `hero/${req.file.filename}`,
      tipo_layout: tipo_layout || "banner",
      mostrar_boton,
      boton_texto: mostrar_boton ? boton_texto : null,
      boton_url: mostrar_boton ? url : null,
      link_url: tipo_layout === "triple" ? link_url : null,
      orden: Number(orden) || 0,
      activo,
    });

    logger.info({
      message: "Hero slide created",
      id: slide.id_hero,
    });

    return res.status(201).json({
      msg: "Hero slide creado correctamente",
      slide,
    });
  } catch (error) {
    logger.error({
      message: "Error creating hero slide",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al crear hero slide" });
  }
};

/* ──────────────────────────────
   🔒 ACTUALIZAR SLIDE
────────────────────────────── */
export const updateHeroSlide = async (req, res) => {
  try {
    logger.info({
      message: "Updating hero slide",
      id: req.params.id,
      body: req.body,
    });

    const { id } = req.params;
    const slide = await HeroSlide.findByPk(id);

    if (!slide) {
      return res.status(404).json({ msg: "Hero slide no encontrado" });
    }

    if (req.body.tipo_layout === "triple" && slide.tipo_layout !== "triple") {
      const totalTriple = await HeroSlide.count({
        where: { tipo_layout: "triple" },
      });

      if (totalTriple >= 3) {
        return res.status(400).json({
          msg: "Solo se permiten máximo 3 banners promocionales",
        });
      }
    }

    if (req.file) {
      if (slide.imagen) {
        const ruta = path.join("uploads", slide.imagen);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      }

      slide.imagen = `hero/${req.file.filename}`;
    }

    slide.titulo1 = req.body.titulo1 ?? slide.titulo1;
    slide.titulo2 = req.body.titulo2 ?? slide.titulo2;
    slide.tipo_layout = req.body.tipo_layout ?? slide.tipo_layout;

    slide.mostrar_boton =
      req.body.mostrar_boton !== undefined
        ? req.body.mostrar_boton === "on"
        : slide.mostrar_boton;

    slide.boton_texto = slide.mostrar_boton
      ? (req.body.boton_texto ?? slide.boton_texto)
      : null;

    slide.boton_url = slide.mostrar_boton
      ? (req.body.boton_url ?? slide.boton_url)
      : null;

    slide.link_url =
      slide.tipo_layout === "triple"
        ? (req.body.link_url ?? slide.link_url)
        : null;

    slide.orden =
      req.body.orden !== undefined ? Number(req.body.orden) : slide.orden;

    slide.activo =
      req.body.activo !== undefined ? req.body.activo === "on" : slide.activo;

    await slide.save();

    logger.info({
      message: "Hero slide updated",
      id: slide.id_hero,
    });

    return res.json({
      msg: "Hero slide actualizado correctamente",
      slide,
    });
  } catch (error) {
    logger.error({
      message: "Error updating hero slide",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al actualizar hero slide" });
  }
};

/* ──────────────────────────────
   🔄 ACTUALIZAR ORDEN
────────────────────────────── */
export const updateHeroOrden = async (req, res) => {
  try {
    logger.info({
      message: "Updating hero order",
      count: req.body.slides?.length,
    });

    const { slides } = req.body;

    if (!Array.isArray(slides)) {
      return res.status(400).json({ msg: "Formato inválido" });
    }

    await Promise.all(
      slides.map((item) =>
        HeroSlide.update(
          { orden: item.orden },
          { where: { id_hero: item.id_hero } },
        ),
      ),
    );

    return res.json({ msg: "Orden actualizado" });
  } catch (error) {
    logger.error({
      message: "Error updating hero order",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al actualizar orden" });
  }
};

/* ──────────────────────────────
   🔒 ELIMINAR SLIDE
────────────────────────────── */
export const deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await HeroSlide.findByPk(id);
    if (!slide) {
      return res.status(404).json({ msg: "Hero slide no encontrado" });
    }

    if (slide.imagen) {
      const ruta = path.join("uploads", slide.imagen);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    await slide.destroy();

    logger.info({
      message: "Hero slide deleted",
      id,
    });

    return res.json({ msg: "Hero slide eliminado correctamente" });
  } catch (error) {
    logger.error({
      message: "Error deleting hero slide",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al eliminar hero slide" });
  }
};
