// libs/api/order.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type PedidoData = {
  nombre_comprador: string;
  dni_comprador: string;
  direccion_envio: string;
  telefono_comprador: string;
  total_pedido: number;

  // 👇 importante: tu service probablemente usa esto
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
};

type PedidoResponse = {
  pedido: {
    id_pedido: number;
  };
};

/* =========================
   CREAR PEDIDO
========================= */
export async function crearPedido(data: PedidoData): Promise<PedidoResponse> {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al crear pedido");
  }

  return result;
}
