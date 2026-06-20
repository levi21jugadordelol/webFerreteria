import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
  obtenerMenuPublico,
  listarMenu,
  crearItemMenu,
  actualizarItemMenu,
  eliminarItemMenu,
  actualizarOrdenMenuService,
  obtenerMenuPorIdService,
} from "./menu.service.js";

/* =========================
   🟢 PUBLICO
========================= */
export const obtenerMenu = asyncHandler(async (req, res) => {
  const menu = await obtenerMenuPublico();

  return res.success({
    data: menu,
  });
});

/* =========================
   🟢 ADMIN
========================= */
export const listarMenuAdmin = asyncHandler(async (req, res) => {
  const menu = await listarMenu();

  return res.success({
    data: menu,
  });
});

/* =========================
   🔒 CREATE
========================= */
export const crearMenu = asyncHandler(async (req, res) => {
  const nuevo = await crearItemMenu(req.body);

  return res.success({
    status: 201,
    message: "Item creado correctamente",
    data: nuevo,
  });
});

/* =========================
   🔄 UPDATE
========================= */
export const actualizarMenu = asyncHandler(async (req, res) => {
  await actualizarItemMenu(req.params.id, req.body);

  return res.success({
    message: "Actualizado",
  });
});

/* =========================
   🔒 DELETE
========================= */
export const eliminarMenu = asyncHandler(async (req, res) => {
  await eliminarItemMenu(req.params.id);

  return res.success({
    message: "Eliminado",
  });
});

/* =========================
   🔄 ORDEN
========================= */
export const actualizarOrdenMenu = asyncHandler(async (req, res) => {
  await actualizarOrdenMenuService(req.body.menus);

  return res.success({
    message: "Orden actualizado",
  });
});

/* =========================
   🆔 GET POR ID
========================= */
export const obtenerMenuPorId = asyncHandler(async (req, res) => {
  const menu = await obtenerMenuPorIdService(req.params.id);

  return res.success({
    data: menu,
  });
});
