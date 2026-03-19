// libs/api/auditPayment.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type PagoAuditoria = {
  id: number;
  accion: string;
  fecha: string;
  // agrega más campos si tu modelo tiene más
};

/* =========================
   LISTAR AUDITORÍA DE PAGOS
========================= */
export async function getAuditoriaPagos(): Promise<PagoAuditoria[]> {
  const res = await fetch(`${API_URL}/auditoria/pagos`, {
    method: "GET",
    credentials: "include", // 🔥 porque usa protegerRuta
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener auditoría de pagos");
  }

  return data;
}
