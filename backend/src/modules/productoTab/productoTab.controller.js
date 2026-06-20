import { ProductoTabService } from "./productoTab.service.js";
import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

/* =============================
   LISTAR
============================= */
export const listarTabs = asyncHandler(async (req, res) => {
  logger.info({ message: "Fetching product tabs" });

  const tabs = await ProductoTabService.listarTabs();

  return res.success({
    data: tabs,
  });
});

/* =============================
   CREAR
============================= */
export const crearTab = asyncHandler(async (req, res) => {
  logger.info({
    message: "Creating product tab",
    nombre: req.body?.nombre,
  });

  const tab = await ProductoTabService.crearTab(req.body);

  logger.info({
    message: "Product tab created",
    tabId: tab.id_tab,
  });

  return res.success({
    status: 201,
    message: "Tab creada",
    data: tab,
  });
});

/* =============================
   ACTUALIZAR
============================= */
export const actualizarTab = asyncHandler(async (req, res) => {
  const tab = await ProductoTabService.actualizarTab(req.params.id, req.body);

  logger.info({
    message: "Product tab updated",
    tabId: Number(req.params.id),
  });

  return res.success({
    message: "Tab actualizada",
    data: tab,
  });
});

/* =============================
   TOGGLE
============================= */
export const toggleTab = asyncHandler(async (req, res) => {
  await ProductoTabService.toggleTab(req.params.id);

  logger.info({
    message: "Product tab toggled",
    tabId: Number(req.params.id),
  });

  return res.success({
    message: "Estado actualizado",
  });
});

/* =============================
   ELIMINAR
============================= */
export const eliminarTab = asyncHandler(async (req, res) => {
  await ProductoTabService.eliminarTab(req.params.id);

  logger.info({
    message: "Product tab deleted",
    tabId: Number(req.params.id),
  });
  return res.success({
    message: "Tab eliminada",
  });
});
