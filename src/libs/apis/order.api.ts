// src/libs/apis/order.api.ts

import { API_URL } from "../../config/api";

type PedidoData = {
  nombre_comprador: string;
  dni_comprador: string;
  direccion_envio: string;
  telefono_comprador: string;
  total_pedido: number;
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
