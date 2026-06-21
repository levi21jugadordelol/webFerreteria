// hero.service.js
import HeroSlide from "./hero.model.js";
import { Op } from "sequelize";
import { subirImagenEditorService } from "../uploads/upload.service.js";
import AppError from "../../shared/utils/AppError.js";

/* =========================
   HELPERS
========================= */
const limpiarTexto = (value = "") => {
  return String(value || "").trim();
};

const normalizarBooleanOn = (value) => {
  return value === true || value === "true" || value === "on";
};

const validarTipoLayout = (tipoLayout) => {
  const permitidos = [
    "banner",
    "text-left",
    "text-right",
    "centered",
    "triple",
  ];

  if (!permitidos.includes(tipoLayout)) {
    throw new AppError("Tipo de layout inválido", 400);
  }
};

/* =========================
   🟢 GET SLIDES
========================= */
export const obtenerSlides = async (type) => {
  const where = { activo: true };

  if (type === "carousel") {
    where.tipo_layout = {
      [Op.in]: ["banner", "text-left", "text-right", "centered"],
    };
  }

  if (type === "triple") {
    where.tipo_layout = "triple";
  }

  return await HeroSlide.findAll({
    where,
    order: [["orden", "ASC"]],
  });
};

/* =========================
   🟢 GET POR ID
========================= */
export const obtenerSlidePorId = async (id) => {
  const slide = await HeroSlide.findByPk(Number(id));

  if (!slide) {
    throw new AppError("Hero slide no encontrado", 404);
  }

  return slide;
};

/* =========================
   🔒 CREAR
========================= */
export const crearSlide = async (data, file) => {
  const titulo1 = limpiarTexto(data.titulo1);
  const titulo2 = limpiarTexto(data.titulo2);
  const tipoLayout = limpiarTexto(data.tipo_layout || "banner");
  const botonTexto = limpiarTexto(data.boton_texto);
  const linkUrl = limpiarTexto(data.link_url);

  let botonUrl = data.boton_url;
  if (Array.isArray(botonUrl)) botonUrl = botonUrl[0];
  botonUrl = limpiarTexto(botonUrl);

  const orden = Number(data.orden || 0);
  const activo = normalizarBooleanOn(data.activo);
  const mostrarBoton = normalizarBooleanOn(data.mostrar_boton);

  validarTipoLayout(tipoLayout);

  if (!file) {
    throw new AppError("Debe subir una imagen", 400);
  }

  if (tipoLayout === "triple") {
    const totalTriple = await HeroSlide.count({
      where: { tipo_layout: "triple" },
    });

    if (totalTriple >= 3) {
      throw new AppError(
        "Solo se permiten máximo 3 banners promocionales",
        400,
      );
    }
  }

  if (tipoLayout !== "banner" && tipoLayout !== "triple") {
    if (!titulo1 && !titulo2) {
      throw new AppError("Este layout requiere texto", 400);
    }
  }

  if (mostrarBoton && (!botonTexto || !botonUrl)) {
    throw new AppError("Debe completar texto y URL del botón", 400);
  }

  const upload = await subirImagenEditorService(file, "hero");

  return await HeroSlide.create({
    titulo1: titulo1 || null,
    titulo2: titulo2 || null,
    imagen: upload.url,
    tipo_layout: tipoLayout,
    mostrar_boton: mostrarBoton,
    boton_texto: mostrarBoton ? botonTexto : null,
    boton_url: mostrarBoton ? botonUrl : null,
    link_url: tipoLayout === "triple" ? linkUrl || null : null,
    orden,
    activo,
  });
};

/* =========================
   🔒 ACTUALIZAR
========================= */
export const actualizarSlide = async (id, data, file) => {
  const slide = await HeroSlide.findByPk(Number(id));

  if (!slide) {
    throw new AppError("Hero slide no encontrado", 404);
  }

  const tipoLayout =
    data.tipo_layout !== undefined
      ? limpiarTexto(data.tipo_layout)
      : slide.tipo_layout;

  validarTipoLayout(tipoLayout);

  if (tipoLayout === "triple" && slide.tipo_layout !== "triple") {
    const totalTriple = await HeroSlide.count({
      where: { tipo_layout: "triple" },
    });

    if (totalTriple >= 3) {
      throw new AppError(
        "Solo se permiten máximo 3 banners promocionales",
        400,
      );
    }
  }

  if (file) {
    const upload = await subirImagenEditorService(file, "hero");
    slide.imagen = upload.url;
  }

  const titulo1 =
    data.titulo1 !== undefined ? limpiarTexto(data.titulo1) : slide.titulo1;

  const titulo2 =
    data.titulo2 !== undefined ? limpiarTexto(data.titulo2) : slide.titulo2;

  const mostrarBoton =
    data.mostrar_boton !== undefined
      ? normalizarBooleanOn(data.mostrar_boton)
      : slide.mostrar_boton;

  let botonUrl = data.boton_url;
  if (Array.isArray(botonUrl)) botonUrl = botonUrl[0];

  const botonTexto =
    data.boton_texto !== undefined
      ? limpiarTexto(data.boton_texto)
      : slide.boton_texto;

  botonUrl =
    data.boton_url !== undefined ? limpiarTexto(botonUrl) : slide.boton_url;

  const linkUrl =
    data.link_url !== undefined ? limpiarTexto(data.link_url) : slide.link_url;

  if (tipoLayout !== "banner" && tipoLayout !== "triple") {
    if (!titulo1 && !titulo2) {
      throw new AppError("Este layout requiere texto", 400);
    }
  }

  if (mostrarBoton && (!botonTexto || !botonUrl)) {
    throw new AppError("Debe completar texto y URL del botón", 400);
  }

  slide.titulo1 = titulo1 || null;
  slide.titulo2 = titulo2 || null;
  slide.tipo_layout = tipoLayout;

  slide.mostrar_boton = mostrarBoton;
  slide.boton_texto = mostrarBoton ? botonTexto : null;
  slide.boton_url = mostrarBoton ? botonUrl : null;

  slide.link_url = tipoLayout === "triple" ? linkUrl || null : null;

  slide.orden =
    data.orden !== undefined ? Number(data.orden) || 0 : slide.orden;

  slide.activo =
    data.activo !== undefined ? normalizarBooleanOn(data.activo) : slide.activo;

  await slide.save();

  return slide;
};

/* =========================
   🔄 ORDEN
========================= */
export const actualizarOrden = async (slides) => {
  if (!Array.isArray(slides)) {
    throw new AppError("Formato inválido", 400);
  }

  await Promise.all(
    slides.map((item) =>
      HeroSlide.update(
        { orden: Number(item.orden) },
        { where: { id_hero: Number(item.id_hero) } },
      ),
    ),
  );

  return true;
};

/* =========================
   🔒 ELIMINAR
========================= */
export const eliminarSlide = async (id) => {
  const slide = await HeroSlide.findByPk(Number(id));

  if (!slide) {
    throw new AppError("Hero slide no encontrado", 404);
  }

  await slide.destroy();

  return true;
};
