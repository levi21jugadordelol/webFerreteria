import HeroSlide from "../models/HeroSlides.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";

/* ──────────────────────────────
   🟢 GET PUBLICO
────────────────────────────── */
export const getHeroSlides = async (req, res) => {
  try {
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.blue("🎯 LISTAR HERO SLIDES (PÚBLICO)"));

    const slides = await HeroSlide.findAll({
      where: { activo: true },
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
  try {
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.yellow("🆕 CREAR HERO SLIDE"));
    console.log(
      chalk.magenta("📦 BODY:"),
      chalk.white(JSON.stringify(req.body, null, 2)),
    );

    const { titulo1, titulo2, orden, tipo_layout, boton_texto, boton_url } =
      req.body;

    const activo = req.body.activo === "on";
    const mostrar_boton = req.body.mostrar_boton === "on";

    if (!req.file) {
      return res.status(400).json({
        msg: "Debe subir una imagen",
      });
    }

    const total = await HeroSlide.count();
    if (total >= 3) {
      console.log(chalk.red("⛔ Límite máximo de 3 slides alcanzado"));
      return res.status(400).json({
        msg: "Solo se permiten máximo 3 slides",
      });
    }

    // 🔥 Validación inteligente según layout
    if (tipo_layout !== "banner") {
      if (!titulo1 && !titulo2) {
        return res.status(400).json({
          msg: "Este layout requiere texto",
        });
      }
    }

    if (mostrar_boton) {
      if (!boton_texto || !boton_url) {
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
      boton_url: mostrar_boton ? boton_url : null,
      orden: Number(orden) || 0,
      activo,
    });

    console.log(
      chalk.blue("🖼 Imagen guardada en:"),
      chalk.white(`uploads/hero/${req.file.filename}`),
    );

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
  try {
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.yellow("✏️ ACTUALIZAR HERO SLIDE"));

    const { id } = req.params;
    const slide = await HeroSlide.findByPk(id);

    if (!slide) {
      return res.status(404).json({ msg: "Hero slide no encontrado" });
    }

    console.log(
      chalk.magenta("📌 ANTES:"),
      chalk.white(JSON.stringify(slide.toJSON(), null, 2)),
    );

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

    slide.orden =
      req.body.orden !== undefined ? Number(req.body.orden) : slide.orden;

    slide.activo =
      req.body.activo !== undefined ? req.body.activo === "on" : slide.activo;

    await slide.save();

    console.log(
      chalk.green("✅ DESPUÉS:"),
      chalk.white(JSON.stringify(slide.toJSON(), null, 2)),
    );

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

    for (const item of slides) {
      await HeroSlide.update(
        { orden: item.orden },
        { where: { id_hero: item.id_hero } },
      );
    }

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
