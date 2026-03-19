// libs/api/payment.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type Comprobante = {
  id_comprobante: number;
  pedido_id: number;
  url_imagen: string;
  estado_validacion: string;
  fecha_hora: string;
};

type ComprobanteResponse = {
  msg: string;
  comprobante?: Comprobante;
};

/* =========================
   SUBIR COMPROBANTE (CLIENTE)
========================= */
export async function subirComprobante(
  pedido_id: number,
  file: File,
): Promise<ComprobanteResponse> {
  const formData = new FormData();
  formData.append("file", file); // 🔥 coincide con multer
  formData.append("pedido_id", String(pedido_id));

  const res = await fetch(`${API_URL}/pagos/comprobante`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al subir comprobante");
  }

  return data;
}

/* =========================
   LISTAR COMPROBANTES (ADMIN)
========================= */
export async function getComprobantes(): Promise<any[]> {
  const res = await fetch(`${API_URL}/pagos/admin/lista`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener comprobantes");
  }

  return data;
}

/* =========================
   VALIDAR COMPROBANTE
========================= */
export async function validarComprobante(id: string): Promise<{ msg: string }> {
  const res = await fetch(`${API_URL}/pagos/admin/${id}/validar`, {
    method: "PUT",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al validar comprobante");
  }

  return data;
}

/* =========================
   RECHAZAR COMPROBANTE
========================= */
export async function rechazarComprobante(
  id: string,
): Promise<{ msg: string }> {
  const res = await fetch(`${API_URL}/pagos/admin/${id}/rechazar`, {
    method: "PUT",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al rechazar comprobante");
  }

  return data;
}

/* =========================
   REVERTIR COMPROBANTE
========================= */
export async function revertirComprobante(
  id: string,
): Promise<{ msg: string }> {
  const res = await fetch(`${API_URL}/pagos/admin/${id}/revertir`, {
    method: "PUT",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al revertir comprobante");
  }

  return data;
}
