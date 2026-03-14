// controllers/comprobantePagoController.js
import ComprobantePago from "../models/Comprobante.js";
import Pedido from "../models/Pedido.js";
import chalk from "chalk";
import PagoService from "../services/PagoService.js";
import { formatearFechaHora } from "../helpers/fechaHelper.js";
import { tiempoPendiente } from "../helpers/tiempoHelper.js";

/* ---------------------------------
   Subir comprobante (cliente)
--------------------------------- */
export const subirComprobante = async (req, res) => {
  console.log(chalk.cyan("📦 BODY:"), req.body);
  console.log(chalk.green("📁 FILE:"), req.file);

  try {
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

    console.log(chalk.greenBright("✅ Comprobante creado"));

    res.status(201).json({
      msg: "Comprobante subido correctamente",
      comprobante,
    });
  } catch (error) {
    console.error(chalk.red("❌ Error al subir comprobante"), error);
    res.status(500).json({ msg: "Error al subir comprobante" });
  }
};

/* ---------------------------------
   Listar comprobantes (admin)
--------------------------------- */
export const listarComprobantes = async (req, res) => {
  try {
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

    res.json(data);
  } catch (error) {
    console.error("🔥 Error al listar comprobantes:", error);
    res.status(500).json({ msg: "Error al listar comprobantes" });
  }
};

/* ---------------------------------
   Validar comprobante (admin)
--------------------------------- */
export const validarComprobante = async (req, res) => {
  try {
    await PagoService.validarComprobante(req.params.id, req.admin);
    res.json({ msg: "Pago validado, stock actualizado" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

/* ---------------------------------
   Rechazar comprobante (admin)
--------------------------------- */
export const rechazarComprobante = async (req, res) => {
  try {
    const { id } = req.params;

    const comprobante = await ComprobantePago.findByPk(id);
    if (!comprobante) {
      return res.status(404).json({ msg: "Comprobante no encontrado" });
    }

    comprobante.estado_validacion = "rechazado";
    await comprobante.save();

    // ❗ El pedido sigue en pendiente
    res.json({ msg: "Comprobante rechazado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al rechazar comprobante" });
  }
};

/* ---------------------------------
   Revertir comprobante (admin)
--------------------------------- */
export const revertirComprobante = async (req, res) => {
  try {
    await PagoService.revertirComprobante(req.params.id, req.admin);
    res.json({ msg: "Pago revertido y stock restaurado" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
