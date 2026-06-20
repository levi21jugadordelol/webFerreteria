import { apiFetch } from "../../api/client";

/* =========================
   TIPOS
========================= */
type Producto = {
  id_producto: number;
  nombre_producto: string;
  slug: string;
  descripcion: string;
  precio: number;
  stock: number;
  url_imagen: string | null;
};

type ProductoResponse = {
  msg: string;
  producto?: Producto;
};

/* =========================
   🟢 PÚBLICO
========================= */

/* LISTAR */
export function getProductos(params?: any): Promise<Producto[]> {
  const query = new URLSearchParams(params || {}).toString();
  return apiFetch(`/productos${query ? `?${query}` : ""}`);
}

/* HOME */
export function getProductosHome(tipo?: string, limit?: number) {
  const params = new URLSearchParams();

  if (tipo) params.append("tipo", tipo);
  if (limit) params.append("limit", String(limit));

  return apiFetch(`/productos/home?${params}`);
}

/* POR SLUG */
export function getProducto(slug: string): Promise<Producto> {
  return apiFetch(`/productos/${slug}`);
}

/* COMPLETO */
export function getProductoCompleto(slug: string) {
  return apiFetch(`/productos/${slug}/full`);
}

/* RELACIONADOS */
export function getRelacionados(slug: string) {
  return apiFetch(`/productos/${slug}/relacionados`);
}

/* CARACTERÍSTICAS */
export function getCaracteristicas(id: string) {
  return apiFetch(`/productos/${id}/caracteristicas`);
}

/* FILTRO PRECIO */
export function filtrarPrecio(min?: number, max?: number) {
  const params = new URLSearchParams();

  if (min) params.append("min", String(min));
  if (max) params.append("max", String(max));

  return apiFetch(`/productos/precio?${params}`);
}

/* =========================
   🔒 ADMIN
========================= */

/* LISTAR ADMIN */
export function getProductosAdmin() {
  return apiFetch(`/productos/admin/lista`);
}

/* OBTENER ADMIN */
export function getProductoAdmin(id: string) {
  return apiFetch(`/productos/admin/${id}`);
}

/* CREAR */
export function crearProducto(formData: FormData) {
  return apiFetch(`/productos/admin`, {
    method: "POST",
    body: formData,
  });
}

/* ACTUALIZAR */
export function actualizarProducto(id: string, data: any) {
  return apiFetch(`/productos/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ELIMINAR */
export function eliminarProducto(id: string) {
  return apiFetch(`/productos/admin/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   🖼 IMÁGENES
========================= */

/* PRINCIPAL */
export function subirImagen(id: string, file: File) {
  const formData = new FormData();
  formData.append("imagen", file);

  return apiFetch(`/productos/admin/${id}/imagen`, {
    method: "POST",
    body: formData,
  });
}

/* EXTRA */
export function subirImagenExtra(id: string, file: File) {
  const formData = new FormData();
  formData.append("imagen", file);

  return apiFetch(`/productos/admin/${id}/imagenes`, {
    method: "POST",
    body: formData,
  });
}

/* ELIMINAR EXTRA */
export function eliminarImagenExtra(id: string, idImg: string) {
  return apiFetch(`/productos/admin/${id}/imagenes/${idImg}`, {
    method: "DELETE",
  });
}

/* =========================
   🧩 CARACTERÍSTICAS
========================= */

export function agregarCaracteristica(id: string, data: any) {
  return apiFetch(`/productos/admin/${id}/caracteristicas`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function actualizarCaracteristica(
  id: string,
  idCarac: string,
  data: any,
) {
  return apiFetch(`/productos/admin/${id}/caracteristicas/${idCarac}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function eliminarCaracteristica(id: string, idCarac: string) {
  return apiFetch(`/productos/admin/${id}/caracteristicas/${idCarac}`, {
    method: "DELETE",
  });
}
