import ComprobantePago from "./payment.model.js";
import Pedido from "../orders/order.model.js";
import PagoService from "./payment.service.js";
import { formatearFechaHora } from "../../shared/helpers/fechaHelper.js";
import { tiempoPendiente } from "../../shared/helpers/tiempoHelper.js";
import logger from "../../shared/logger/logger.js";

/* ---------------------------------
   Subir comprobante (cliente)
--------------------------------- */
export const subirComprobante = async (req, res) => {
  try {
    logger.info({
      message: "Uploading payment proof",
      body: req.body,
    });

    const { pedido_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "Debe subir una imagen" });
    }

    const pedido = await Pedido.findByPk(pedido_id);
    if (!pedido) {
      return res.status(404).json({ msg: "Pedido no encontrado" });
    }

    const existe = await ComprobantePago.findOne({ where: { pedido_id } });
    if (existe) {
      return res
        .status(400)
        .json({ msg: "Este pedido ya tiene un comprobante" });
    }

    const comprobante = await ComprobantePago.create({
      pedido_id,
      url_imagen: `/uploads/comprobantes/${req.file.filename}`,
      estado_validacion: "pendiente",
    });

    logger.info({
      message: "Payment proof created",
      id: comprobante.id_comprobante,
    });

    return res.status(201).json({
      msg: "Comprobante subido correctamente",
      comprobante,
    });
  } catch (error) {
    logger.error({
      message: "Error uploading payment proof",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al subir comprobante" });
  }
};

/* ---------------------------------
   Listar comprobantes (admin)
--------------------------------- */
export const listarComprobantes = async (req, res) => {
  try {
    logger.info({
      message: "Fetching payment proofs",
    });

    const comprobantes = await ComprobantePago.findAll({
      include: [
        {
          model: Pedido,
          as: "pedido",
          attributes: [
            "id_pedido",
            "nombre_comprador",
            "direccion_envio",
            "total_pedido",
            "estado_pedido",
          ],
        },
      ],
      order: [["fecha_hora", "DESC"]],
    });

    const data = comprobantes.map((c) => ({
      ...c.toJSON(),
      fecha_envio: formatearFechaHora(c.fecha_hora),
      fecha_validacion: formatearFechaHora(c.fecha_validacion_pago),
      tiempo_pendiente:
        c.estado_validacion === "pendiente"
          ? tiempoPendiente(c.fecha_hora)
          : "-",
    }));

    const prioridad = {
      pendiente: 1,
      vencido: 2,
      validado: 3,
      rechazado: 4,
    };

    data.sort((a, b) => {
      return prioridad[a.estado_validacion] - prioridad[b.estado_validacion];
    });

    return res.json(data);
  } catch (error) {
    logger.error({
      message: "Error fetching payment proofs",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al listar comprobantes" });
  }
};

/* ---------------------------------
   Validar comprobante (admin)
--------------------------------- */
export const validarComprobante = async (req, res) => {
  try {
    logger.info({
      message: "Validating payment proof",
      id: req.params.id,
      admin: req.admin?.id_administrador,
    });

    await PagoService.validarComprobante(req.params.id, req.admin);

    return res.json({ msg: "Pago validado, stock actualizado" });
  } catch (error) {
    logger.error({
      message: "Error validating payment proof",
      error: error.message,
    });

    return res.status(400).json({ msg: error.message });
  }
};

/* ---------------------------------
   Rechazar comprobante (admin)
--------------------------------- */
export const rechazarComprobante = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info({
      message: "Rejecting payment proof",
      id,
    });

    const comprobante = await ComprobantePago.findByPk(id);
    if (!comprobante) {
      return res.status(404).json({ msg: "Comprobante no encontrado" });
    }

    comprobante.estado_validacion = "rechazado";
    await comprobante.save();

    return res.json({ msg: "Comprobante rechazado" });
  } catch (error) {
    logger.error({
      message: "Error rejecting payment proof",
      error: error.message,
    });

    return res.status(500).json({ msg: "Error al rechazar comprobante" });
  }
};

/* ---------------------------------
   Revertir comprobante (admin)
--------------------------------- */
export const revertirComprobante = async (req, res) => {
  try {
    logger.info({
      message: "Reverting payment proof",
      id: req.params.id,
      admin: req.admin?.id_administrador,
    });

    await PagoService.revertirComprobante(req.params.id, req.admin);

    return res.json({ msg: "Pago revertido y stock restaurado" });
  } catch (error) {
    logger.error({
      message: "Error reverting payment proof",
      error: error.message,
    });

    return res.status(400).json({ msg: error.message });
  }
};
