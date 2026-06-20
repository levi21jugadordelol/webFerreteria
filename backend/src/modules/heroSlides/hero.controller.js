import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
  obtenerSlides,
  obtenerSlidePorId,
  crearSlide,
  actualizarSlide,
  actualizarOrden,
  eliminarSlide,
} from "./hero.service.js";

/* =========================
   🟢 GET
========================= */
export const getHeroSlides = asyncHandler(async (req, res) => {
  const slides = await obtenerSlides(req.query.type);

  return res.success({
    data: slides,
  });
});

export const getHeroById = asyncHandler(async (req, res) => {
  const slide = await obtenerSlidePorId(req.params.id);

  return res.success({
    data: slide,
  });
});

/* =========================
   🔒 CREATE
========================= */
export const createHeroSlide = asyncHandler(async (req, res) => {
  const slide = await crearSlide(req.body, req.file);

  logger.info({
    message: "Hero slide created",
    heroId: slide.id_hero,
  });

  return res.success({
    status: 201,
    message: "Hero slide creado correctamente",
    data: slide,
  });
});

/* =========================
   🔒 UPDATE
========================= */
export const updateHeroSlide = asyncHandler(async (req, res) => {
  const slide = await actualizarSlide(req.params.id, req.body, req.file);

  logger.info({
    message: "Hero slide updated",
    heroId: Number(req.params.id),
  });

  return res.success({
    message: "Hero slide actualizado correctamente",
    data: slide,
  });
});

/* =========================
   🔄 ORDEN
========================= */
export const updateHeroOrden = asyncHandler(async (req, res) => {
  await actualizarOrden(req.body.slides);

  return res.success({
    message: "Orden actualizado",
  });
});

/* =========================
   🔒 DELETE
========================= */
export const deleteHeroSlide = asyncHandler(async (req, res) => {
  await eliminarSlide(req.params.id);

  logger.info({
    message: "Hero slide deleted",
    heroId: Number(req.params.id),
  });

  return res.success({
    message: "Hero slide eliminado correctamente",
  });
});
