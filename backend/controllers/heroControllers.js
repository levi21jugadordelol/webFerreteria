import HeroSlide from "../models/HeroSlides.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";

/* ──────────────────────────────
   🟢 GET PUBLICO
────────────────────────────── */
export const getHeroSlides = async (req, res) => {
  try {
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.blue("🎯 LISTAR HERO SLIDES"));

    const { type } = req.query;

    let where = { activo: true };

    // 🔹 hero carrusel
    if (type === "carousel") {
      where.tipo_layout = {
        [Op.in]: ["banner", "text-left", "text-right", "centered"],
      };
    }

    // 🔹 banners promocionales
    if (type === "triple") {
      where.tipo_layout = "triple";
    }

    const slides = await HeroSlide.findAll({
      where,
      order: [["orden", "ASC"]],
    });

    console.log(chalk.green(`✅ Slides encontrados: ${slides.length}`));

    res.json(slides);
  } catch (error) {
    console.error(chalk.bgRed.white("❌ Error en getHeroSlides:"), error);
    res.status(500).json({ msg: "Error al obtener hero slides" });
  }
};

/* ──────────────────────────────
   🟢 GET POR ID (ADMIN)
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

    res.json(slide);
  } catch (error) {
    console.error("❌ Error en getHeroById:", error);
    res.status(500).json({
      msg: "Error al obtener hero slide",
    });
  }
};

/* ──────────────────────────────
   🔒 CREAR SLIDE
────────────────────────────── */
export const createHeroSlide = async (req, res) => {
  console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.blue("📥 BODY RECIBIDO"));

  console.log(chalk.yellow("tipo_layout:"), req.body.tipo_layout);
  console.log(chalk.yellow("link_url:"), req.body.link_url);
  console.log(chalk.yellow("boton_url:"), req.body.boton_url);
  console.log(chalk.yellow("activo:"), req.body.activo);

  console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  try {
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.yellow("🆕 CREAR HERO SLIDE"));

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

    if (Array.isArray(url)) {
      url = url[0];
    }

    const activo = req.body.activo === "on";
    const mostrar_boton = req.body.mostrar_boton === "on";

    if (!req.file) {
      return res.status(400).json({
        msg: "Debe subir una imagen",
      });
    }

    /* LIMITE SOLO PARA TRIPLE */

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

    /* VALIDACIÓN TEXTO */

    if (tipo_layout !== "banner" && tipo_layout !== "triple") {
      if (!titulo1 && !titulo2) {
        return res.status(400).json({
          msg: "Este layout requiere texto",
        });
      }
    }

    /* VALIDAR BOTÓN */

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

      // 🔗 SOLO PARA TRIPLE
      link_url: tipo_layout === "triple" ? link_url : null,

      orden: Number(orden) || 0,
      activo,
    });

    console.log(chalk.green(`✅ Slide creado ID: ${slide.id_hero}`));

    res.status(201).json({
      msg: "Hero slide creado correctamente",
      slide,
    });
  } catch (error) {
    console.error(chalk.bgRed.white("❌ Error en createHeroSlide:"), error);
    res.status(500).json({ msg: "Error al crear hero slide" });
  }
};

/* ──────────────────────────────
   🔒 ACTUALIZAR SLIDE
────────────────────────────── */
export const updateHeroSlide = async (req, res) => {
  console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.yellow("✏️ ACTUALIZAR HERO SLIDE"));
  console.log(chalk.blue("📦 BODY RECIBIDO →"), req.body);

  console.log(chalk.magenta("🔗 LINK_URL →"), req.body.link_url);
  console.log(chalk.magenta("🎨 LAYOUT →"), req.body.tipo_layout);
  console.log(chalk.magenta("🟢 ACTIVO →"), req.body.activo);

  console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  try {
    console.log(chalk.yellow("✏️ ACTUALIZAR HERO SLIDE"));

    const { id } = req.params;
    const slide = await HeroSlide.findByPk(id);

    if (!slide) {
      return res.status(404).json({ msg: "Hero slide no encontrado" });
    }

    /* VALIDAR LIMITE TRIPLE */

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

    /* CAMBIO IMAGEN */

    if (req.file) {
      if (slide.imagen) {
        const ruta = path.join("uploads", slide.imagen);
        if (fs.existsSync(ruta)) {
          fs.unlinkSync(ruta);
        }
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

    // 🔗 LINK PARA TRIPLE
    slide.link_url =
      slide.tipo_layout === "triple"
        ? (req.body.link_url ?? slide.link_url)
        : null;

    slide.orden =
      req.body.orden !== undefined ? Number(req.body.orden) : slide.orden;

    slide.activo =
      req.body.activo !== undefined ? req.body.activo === "on" : slide.activo;

    await slide.save();
    console.log(chalk.green("✅ LINK GUARDADO →"), slide.link_url);
    res.json({
      msg: "Hero slide actualizado correctamente",
      slide,
    });
  } catch (error) {
    console.error(chalk.bgRed.white("❌ Error en updateHeroSlide:"), error);
    res.status(500).json({ msg: "Error al actualizar hero slide" });
  }
};

/* ──────────────────────────────
   🔄 ACTUALIZAR ORDEN
────────────────────────────── */
export const updateHeroOrden = async (req, res) => {
  try {
    console.log(chalk.yellow("🔄 ACTUALIZAR ORDEN HERO"));

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

    console.log(chalk.green("✅ Orden actualizado"));

    res.json({ msg: "Orden actualizado" });
  } catch (error) {
    console.error(chalk.bgRed.white("❌ Error en updateHeroOrden:"), error);
    res.status(500).json({ msg: "Error al actualizar orden" });
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
      if (fs.existsSync(ruta)) {
        fs.unlinkSync(ruta);
      }
    }

    await slide.destroy();

    console.log(chalk.redBright(`🗑️ Slide eliminado ID: ${id}`));

    res.json({ msg: "Hero slide eliminado correctamente" });
  } catch (error) {
    console.error(chalk.bgRed.white("❌ Error en deleteHeroSlide:"), error);
    res.status(500).json({ msg: "Error al eliminar hero slide" });
  }
};
