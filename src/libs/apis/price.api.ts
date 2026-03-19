// libs/api/price.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type Producto = {
  id_producto: number;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  url_imagen: string;
  stock: number;
};

/* =========================
   FILTRAR POR PRECIO
========================= */
export async function filtrarPorPrecio(
  min?: number,
  max?: number,
): Promise<Producto[]> {
  let url = `${API_URL}/productos/precio`;

  const params = new URLSearchParams();

  if (min !== undefined) params.append("min", String(min));
  if (max !== undefined) params.append("max", String(max));

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al filtrar productos");
  }

  return data;
}
