import PagoAuditoria from "../models/PagoAuditoria.js";

export const listarAuditoriaPagos = async (req, res) => {
  const logs = await PagoAuditoria.findAll({
    order: [["fecha", "DESC"]],
  });

  res.json(logs);
};
