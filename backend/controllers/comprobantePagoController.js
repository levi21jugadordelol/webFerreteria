// controllers/comprobantePagoController.js
import ComprobantePago from "../models/Comprobante.js";
import Pedido from "../models/Pedido.js";

/* ---------------------------------
   Subir comprobante (cliente)
--------------------------------- */
export const subirComprobante = async (req, res) => {
  try {
    const { pedido_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "Debe subir una imagen" });
    }

    const pedido = await Pedido.findByPk(pedido_id);
    if (!pedido) {
      return res.status(404).json({ msg: "Pedido no encontrado" });
    }

    // ❗ Evitar múltiples comprobantes para el mismo pedido
    const existe = await ComprobantePago.findOne({
      where: { pedido_id },
    });

    if (existe) {
      return res
        .status(400)
        .json({ msg: "Este pedido ya tiene un comprobante" });
    }

    const comprobante = await ComprobantePago.create({
      pedido_id,
      url_imagen: req.file.filename,
      estado_validacion: "pendiente",
    });

    res.status(201).json({
      msg: "Comprobante subido correctamente",
      comprobante,
    });
  } catch (error) {
    console.error(error);
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
          attributes: [
            "id_pedido",
            "nombre_comprador",
            "total_pedido",
            "estado_pedido",
          ],
        },
      ],
      order: [["fecha_hora", "DESC"]],
    });

    res.json(comprobantes);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar comprobantes" });
  }
};

/* ---------------------------------
   Validar comprobante (admin)
--------------------------------- */
export const validarComprobante = async (req, res) => {
  try {
    const { id } = req.params;

    const comprobante = await ComprobantePago.findByPk(id);
    if (!comprobante) {
      return res.status(404).json({ msg: "Comprobante no encontrado" });
    }

    comprobante.estado_validacion = "validado";
    await comprobante.save();

    // 🔥 Cambiar estado del pedido a PAGADO
    await Pedido.update(
      { estado_pedido: "pagado" },
      { where: { id_pedido: comprobante.pedido_id } }
    );

    res.json({ msg: "Comprobante validado y pedido marcado como pagado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al validar comprobante" });
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
