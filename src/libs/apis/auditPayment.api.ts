import { apiFetch } from "../../api/client";

type PagoAuditoria = {
  id: number;
  accion: string;
  fecha: string;
};

export function getAuditoriaPagos(): Promise<PagoAuditoria[]> {
  return apiFetch("/auditoria/pagos");
}
