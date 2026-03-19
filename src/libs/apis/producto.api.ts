// libs/api/producto.api.ts

const API_URL = "http://localhost:3000";

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
export async function getProductos(params?: any): Promise<Producto[]> {
  const query = new URLSearchParams(params || {}).toString();

  const res = await fetch(`${API_URL}/productos${query ? `?${query}` : ""}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al listar productos");
  }

  return data;
}

/* HOME */
export async function getProductosHome(tipo?: string, limit?: number) {
  const params = new URLSearchParams();

  if (tipo) params.append("tipo", tipo);
  if (limit) params.append("limit", String(limit));

  const res = await fetch(`${API_URL}/productos/home?${params}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error productos home");
  }

  return data;
}

/* POR SLUG */
export async function getProducto(slug: string): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos/${slug}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Producto no encontrado");
  }

  return data;
}

/* COMPLETO */
export async function getProductoCompleto(slug: string) {
  const res = await fetch(`${API_URL}/productos/${slug}/full`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error producto completo");
  }

  return data;
}

/* RELACIONADOS */
export async function getRelacionados(slug: string) {
  const res = await fetch(`${API_URL}/productos/${slug}/relacionados`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error relacionados");
  }

  return data;
}

/* CARACTERÍSTICAS */
export async function getCaracteristicas(id: string) {
  const res = await fetch(`${API_URL}/productos/${id}/caracteristicas`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error características");
  }

  return data;
}

/* FILTRO PRECIO */
export async function filtrarPrecio(min?: number, max?: number) {
  const params = new URLSearchParams();

  if (min) params.append("min", String(min));
  if (max) params.append("max", String(max));

  const res = await fetch(`${API_URL}/productos/precio?${params}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error filtro precio");
  }

  return data;
}

/* =========================
   🔒 ADMIN
========================= */

/* LISTAR ADMIN */
export async function getProductosAdmin() {
  const res = await fetch(`${API_URL}/productos/admin/lista`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.msg);
  return data;
}

/* OBTENER ADMIN */
export async function getProductoAdmin(id: string) {
  const res = await fetch(`${API_URL}/productos/admin/${id}`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.msg);
  return data;
}

/* CREAR */
export async function crearProducto(formData: FormData) {
  const res = await fetch(`${API_URL}/productos/admin`, {
    method: "POST",
    credentials: "include",
    body: formData, // 🔥 imagen incluida
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.msg);
  return data;
}

/* ACTUALIZAR */
export async function actualizarProducto(id: string, data: any) {
  const res = await fetch(`${API_URL}/productos/admin/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.msg);
  return result;
}

/* ELIMINAR */
export async function eliminarProducto(id: string) {
  const res = await fetch(`${API_URL}/productos/admin/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.msg);
}

/* =========================
   🖼 IMÁGENES
========================= */

/* PRINCIPAL */
export async function subirImagen(id: string, file: File) {
  const formData = new FormData();
  formData.append("imagen", file);

  const res = await fetch(`${API_URL}/productos/admin/${id}/imagen`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.msg);
  return data;
}

/* EXTRA */
export async function subirImagenExtra(id: string, file: File) {
  const formData = new FormData();
  formData.append("imagen", file);

  const res = await fetch(`${API_URL}/productos/admin/${id}/imagenes`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.msg);
  return data;
}

/* ELIMINAR EXTRA */
export async function eliminarImagenExtra(id: string, idImg: string) {
  const res = await fetch(
    `${API_URL}/productos/admin/${id}/imagenes/${idImg}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.msg);
}

/* =========================
   🧩 CARACTERÍSTICAS
========================= */

export async function agregarCaracteristica(id: string, data: any) {
  const res = await fetch(`${API_URL}/productos/admin/${id}/caracteristicas`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.msg);
  return result;
}

export async function actualizarCaracteristica(
  id: string,
  idCarac: string,
  data: any,
) {
  const res = await fetch(
    `${API_URL}/productos/admin/${id}/caracteristicas/${idCarac}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result = await res.json();

  if (!res.ok) throw new Error(result.msg);
  return result;
}

export async function eliminarCaracteristica(id: string, idCarac: string) {
  const res = await fetch(
    `${API_URL}/productos/admin/${id}/caracteristicas/${idCarac}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.msg);
}
