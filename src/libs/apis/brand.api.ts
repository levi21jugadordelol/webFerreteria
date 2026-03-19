// libs/api/marca.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type Marca = {
  id_marca: number;
  nombre_marca: string;
  descripcion: string;
  url_logo: string;
};

type MarcaResponse = {
  msg: string;
  marca?: Marca;
};

/* =========================
   CREAR MARCA
========================= */
export async function crearMarca(data: {
  nombre_marca: string;
  descripcion: string;
}): Promise<MarcaResponse> {
  const res = await fetch(`${API_URL}/marcas`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al crear marca");
  }

  return result;
}

/* =========================
   LISTAR MARCAS
========================= */
export async function getMarcas(): Promise<Marca[]> {
  const res = await fetch(`${API_URL}/marcas`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener marcas");
  }

  return data;
}

/* =========================
   OBTENER POR ID
========================= */
export async function getMarcaById(id: string): Promise<Marca> {
  const res = await fetch(`${API_URL}/marcas/${id}`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener marca");
  }

  return data;
}

/* =========================
   ACTUALIZAR
========================= */
export async function actualizarMarca(
  id: string,
  data: Partial<Marca>,
): Promise<MarcaResponse> {
  const res = await fetch(`${API_URL}/marcas/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al actualizar marca");
  }

  return result;
}

/* =========================
   ELIMINAR
========================= */
export async function eliminarMarca(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/marcas/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al eliminar marca");
  }
}

/* =========================
   SUBIR LOGO
========================= */
export async function subirLogoMarca(
  id: string,
  file: File,
): Promise<MarcaResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/marcas/subir-logo/${id}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al subir logo");
  }

  return data;
}
