import PriceService from "./price.service.js";
import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

/* =============================
   Filtrar por precio
============================= */
export const filtrarPorPrecio = asyncHandler(async (req, res) => {
  const productos = await PriceService.filtrarPorPrecio(req.query);

  logger.info({
    message: "Products filtered by price",
    min: req.query?.min ?? null,
    max: req.query?.max ?? null,
    total: productos.length,
  });

  return res.success({
    data: productos,
  });
});
