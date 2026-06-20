import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
  crearPaginaService,
  listarPaginasAdminService,
  obtenerPaginaService,
  obtenerPaginaAdminService,
  actualizarPaginaService,
  listarPaginasService,
  eliminarPaginaService,
} from "./pagina.service.js";

/* =============================
   CREATE
============================= */
export const crearPagina = asyncHandler(async (req, res) => {
  logger.info({
    message: "Creating page",
    titulo: req.body?.titulo,
    slug: req.body?.slug,
    template: req.body?.template,
  });

  const pagina = await crearPaginaService(req.body);

  logger.info({
    event: "PAGE_CREATED",
    adminId: req.admin?.id_administrador,
    pageId: pagina.id_pagina,
    slug: pagina.slug,
  });

  return res.success({
    status: 201,
    message: "Página creada correctamente",
    data: pagina,
  });
});

/* =============================
   ADMIN LIST
============================= */
export const listarPaginasAdmin = asyncHandler(async (req, res) => {
  const paginas = await listarPaginasAdminService();

  return res.success({
    data: paginas,
  });
});

/* =============================
   PUBLIC GET
============================= */
export const obtenerPagina = asyncHandler(async (req, res) => {
  const pagina = await obtenerPaginaService(req.params.slug);

  return res.success({
    data: pagina,
  });
});

/* =============================
   ADMIN GET
============================= */
export const obtenerPaginaAdmin = asyncHandler(async (req, res) => {
  const pagina = await obtenerPaginaAdminService(req.params.id);

  return res.success({
    data: pagina,
  });
});

/* =============================
   UPDATE
============================= */
export const actualizarPagina = asyncHandler(async (req, res) => {
  await actualizarPaginaService(req.params.id, req.body);

  logger.info({
    event: "PAGE_UPDATED",
    adminId: req.admin?.id_administrador,
    pageId: Number(req.params.id),
  });

  return res.success({
    message: "Página actualizada",
  });
});

/* =============================
   PUBLIC LIST
============================= */
export const listarPaginas = asyncHandler(async (req, res) => {
  const paginas = await listarPaginasService();

  return res.success({
    data: paginas,
  });
});

/* =============================
   DELETE
============================= */
export const eliminarPagina = asyncHandler(async (req, res) => {
  await eliminarPaginaService(req.params.id);

  logger.info({
    event: "PAGE_DELETED",
    adminId: req.admin?.id_administrador,
    pageId: Number(req.params.id),
  });

  return res.success({
    message: "Página eliminada",
  });
});
