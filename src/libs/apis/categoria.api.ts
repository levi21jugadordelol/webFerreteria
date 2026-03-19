// libs/api/categoria.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type Categoria = {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
  url_imagen: string | null;
};

type CategoriaResponse = {
  msg: string;
  categoria?: Categoria;
};

/* =========================
   CREAR CATEGORÍA
========================= */
export async function crearCategoria(
  formData: FormData,
): Promise<CategoriaResponse> {
  const res = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    credentials: "include",
    body: formData, // 🔥 importante (multer)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al crear categoría");
  }

  return data;
}

/* =========================
   LISTAR
========================= */
export async function getCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${API_URL}/categorias`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al cargar categorías");
  }

  return data;
}

/* =========================
   OBTENER POR ID
========================= */
export async function getCategoriaById(id: string): Promise<Categoria> {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener categoría");
  }

  return data;
}

/* =========================
   ACTUALIZAR
========================= */
export async function actualizarCategoria(
  id: string,
  data: {
    nombre_categoria?: string;
    descripcion?: string;
  },
): Promise<CategoriaResponse> {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al actualizar categoría");
  }

  return result;
}

/* =========================
   ELIMINAR
========================= */
export async function eliminarCategoria(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al eliminar categoría");
  }
}

/* =========================
   SUBIR IMAGEN
========================= */
export async function subirImagenCategoria(
  id: string,
  file: File,
): Promise<CategoriaResponse> {
  const formData = new FormData();
  formData.append("file", file); // 🔥 coincide con multer

  const res = await fetch(`${API_URL}/categorias/subir-imagen/${id}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al subir imagen");
  }

  return data;
}
