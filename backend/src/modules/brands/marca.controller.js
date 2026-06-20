import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
  crearMarcaService,
  listarMarcasService,
  obtenerMarcaService,
  actualizarMarcaService,
  eliminarMarcaService,
  subirLogoMarcaService,
} from "./marca.service.js";

/* =========================
   CREAR MARCA
========================= */
export const crearMarca = asyncHandler(async (req, res) => {
  const marca = await crearMarcaService(req.body);

  logger.info({
    message: "Brand created",
    brandId: marca.id_marca,
  });

  return res.success({
    status: 201,
    message: "Marca creada correctamente",
    data: marca,
  });
});

/* =========================
   LISTAR MARCAS
========================= */
export const listarMarcas = asyncHandler(async (req, res) => {
  const marcas = await listarMarcasService();

  return res.success({
    data: marcas,
  });
});

/* =========================
   OBTENER MARCA
========================= */
export const obtenerMarca = asyncHandler(async (req, res) => {
  const marca = await obtenerMarcaService(req.params.id);

  return res.success({
    data: marca,
  });
});

/* =========================
   ACTUALIZAR MARCA
========================= */
export const actualizarMarca = asyncHandler(async (req, res) => {
  const marca = await actualizarMarcaService(req.params.id, req.body);

  logger.info({
    message: "Brand updated",
    brandId: marca.id_marca,
  });

  return res.success({
    message: "Marca actualizada correctamente",
    data: marca,
  });
});

/* =========================
   ELIMINAR MARCA
========================= */
export const eliminarMarca = asyncHandler(async (req, res) => {
  await eliminarMarcaService(req.params.id);

  logger.info({
    message: "Brand deleted",
    brandId: Number(req.params.id),
  });

  return res.success({
    message: "Marca eliminada correctamente",
  });
});

/* =========================
   SUBIR LOGO
========================= */
export const subirLogoMarca = asyncHandler(async (req, res) => {
  const result = await subirLogoMarcaService(req.params.id, req.file);

  logger.info({
    message: "Brand logo uploaded",
    brandId: Number(req.params.id),
    hasFile: Boolean(req.file),
  });

  return res.success({
    message: "Logo de marca subido correctamente",
    data: result,
  });
});
