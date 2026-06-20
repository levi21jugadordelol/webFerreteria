import Pagina from "../../modules/pages/pagina.model.js";
import AppError from "../../shared/utils/AppError.js";
import sanitizeHtml from "sanitize-html";
import { Op } from "sequelize";

/* =============================
   Helpers
============================= */
const generarSlug = (slug = "") => {
  return String(slug)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const sanitizarContenidoPagina = (html = "") => {
  return sanitizeHtml(String(html), {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "h1",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "blockquote",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "loading"],
      span: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
};

const sanitizarTexto = (valor = "") => {
  return sanitizeHtml(String(valor || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};

/* =============================
   SERVICES
============================= */

export const crearPaginaService = async (data) => {
  let { titulo, slug, contenido, template, imagen_portada, meta_description } =
    data;

  titulo = sanitizarTexto(titulo);
  slug = String(slug || "").trim();
  contenido = String(contenido || "").trim();
  meta_description = sanitizarTexto(meta_description);
  template = template || "default";

  if (!titulo || !slug || !contenido) {
    throw new AppError("Todos los campos son obligatorios", 400);
  }

  slug = generarSlug(slug);

  const existe = await Pagina.findOne({ where: { slug } });

  if (existe) {
    throw new AppError("Ya existe una página con ese slug", 400);
  }

  if (template !== "default" && !imagen_portada) {
    throw new AppError("Este template requiere imagen", 400);
  }

  contenido = sanitizarContenidoPagina(contenido);

  return await Pagina.create({
    titulo,
    slug,
    contenido,
    template,
    imagen_portada,
    meta_description,
    activo: true,
  });
};

export const listarPaginasAdminService = async () => {
  return await Pagina.findAll({
    order: [["createdAt", "DESC"]],
  });
};

export const obtenerPaginaService = async (slug) => {
  const pagina = await Pagina.findOne({
    where: { slug, activo: true },
  });

  if (!pagina) {
    throw new AppError("Página no encontrada", 404);
  }

  return pagina;
};

export const obtenerPaginaAdminService = async (id) => {
  const pagina = await Pagina.findByPk(id);

  if (!pagina) {
    throw new AppError("Página no encontrada", 404);
  }

  return pagina;
};

export const actualizarPaginaService = async (id, data) => {
  const pagina = await Pagina.findByPk(id);

  if (!pagina) {
    throw new AppError("Página no encontrada", 404);
  }

  if (data.slug) {
    data.slug = generarSlug(data.slug);

    const existe = await Pagina.findOne({
      where: {
        slug: data.slug,
        id_pagina: { [Op.ne]: id },
      },
    });

    if (existe) {
      throw new AppError("Ya existe una página con ese slug", 400);
    }
  }

  if (data.contenido) {
    data.contenido = sanitizarContenidoPagina(data.contenido);
  }

  const camposPermitidos = {};

  if (data.titulo !== undefined) {
    data.titulo = sanitizarTexto(data.titulo);
  }

  if (data.meta_description !== undefined) {
    data.meta_description = sanitizarTexto(data.meta_description);
  }

  if (data.titulo !== undefined) camposPermitidos.titulo = data.titulo;
  if (data.slug !== undefined) camposPermitidos.slug = data.slug;
  if (data.contenido !== undefined) camposPermitidos.contenido = data.contenido;
  if (data.template !== undefined) camposPermitidos.template = data.template;
  if (data.imagen_portada !== undefined)
    camposPermitidos.imagen_portada = data.imagen_portada;
  if (data.meta_description !== undefined)
    camposPermitidos.meta_description = data.meta_description;
  if (data.activo !== undefined) camposPermitidos.activo = data.activo;

  await pagina.update(camposPermitidos);

  return pagina;
};

export const listarPaginasService = async () => {
  return await Pagina.findAll({
    where: { activo: true },
    attributes: ["titulo", "slug"],
    order: [["titulo", "ASC"]],
  });
};

export const eliminarPaginaService = async (id) => {
  const pagina = await Pagina.findByPk(id);

  if (!pagina) {
    throw new AppError("Página no encontrada", 404);
  }

  await pagina.destroy();

  return true;
};
