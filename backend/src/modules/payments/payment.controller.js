import PagoService from "./payment.service.js";
import logger from "../../shared/logger/logger.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

/* ---------------------------------
   Subir comprobante (cliente)
--------------------------------- */
export const subirComprobante = asyncHandler(async (req, res) => {
  logger.info({
    message: "Uploading payment proof",
    pedido_id: req.body?.pedido_id,
    hasFile: Boolean(req.file),
  });

  const comprobante = await PagoService.subirComprobante(req.body, req.file);

  return res.success({
    status: 201,
    message: "Comprobante subido correctamente",
    data: comprobante,
  });
});

/* ---------------------------------
   Listar comprobantes (admin)
--------------------------------- */
export const listarComprobantes = asyncHandler(async (req, res) => {
  logger.info({
    message: "Fetching payment proofs",
  });

  const { search = "", page = 1, limit = 10 } = req.query;

  const data = await PagoService.listarComprobantes({
    search,
    page: Number(page),
    limit: Number(limit),
  });

  return res.success({
    data,
  });
});

/* ---------------------------------
   Validar comprobante (admin)
--------------------------------- */
export const validarComprobante = asyncHandler(async (req, res) => {
  logger.info({
    message: "Validating payment proof",
    id: req.params.id,
    admin: req.admin?.id_administrador,
  });

  await PagoService.validarComprobante(req.params.id, req.admin);

  return res.success({
    message: "Pago validado, stock actualizado",
  });
});

/* ---------------------------------
   Rechazar comprobante (admin)
--------------------------------- */
export const rechazarComprobante = asyncHandler(async (req, res) => {
  logger.info({
    message: "Rejecting payment proof",
    id: req.params.id,
  });

  await PagoService.rechazarComprobante(req.params.id);

  return res.success({
    message: "Comprobante rechazado",
  });
});

/* ---------------------------------
   Revertir comprobante (admin)
--------------------------------- */
export const revertirComprobante = asyncHandler(async (req, res) => {
  logger.info({
    message: "Reverting payment proof",
    id: req.params.id,
    admin: req.admin?.id_administrador,
  });

  await PagoService.revertirComprobante(req.params.id, req.admin);

  return res.success({
    message: "Pago revertido y stock restaurado",
  });
});
