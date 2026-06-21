import { apiFetch } from "../../api/client";

type Producto = {
  id_producto: number;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  url_imagen: string;
  stock: number;
};

export function filtrarPorPrecio(
  min?: number,
  max?: number,
): Promise<Producto[]> {
  const params = new URLSearchParams();

  if (min !== undefined) params.append("min", String(min));
  if (max !== undefined) params.append("max", String(max));

  const query = params.toString();

  return apiFetch(`/productos/precio${query ? `?${query}` : ""}`);
}
