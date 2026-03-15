import PagoAuditoria from "../audit-payments/auditPayment.model.js";

export const listarAuditoriaPagos = async (req, res) => {
  const logs = await PagoAuditoria.findAll({
    order: [["fecha", "DESC"]],
  });

  res.json(logs);
};
