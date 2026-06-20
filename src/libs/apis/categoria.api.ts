import { apiFetch } from "../../api/client";

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
export function crearCategoria(formData: FormData): Promise<CategoriaResponse> {
  return apiFetch("/categorias", {
    method: "POST",
    body: formData,
  });
}

/* =========================
   LISTAR
========================= */
export function getCategorias(): Promise<Categoria[]> {
  return apiFetch("/categorias");
}

/* =========================
   OBTENER POR ID
========================= */
export function getCategoriaById(id: string): Promise<Categoria> {
  return apiFetch(`/categorias/${id}`);
}

/* =========================
   ACTUALIZAR
========================= */
export function actualizarCategoria(
  id: string,
  data: {
    nombre_categoria?: string;
    descripcion?: string;
  },
): Promise<CategoriaResponse> {
  return apiFetch(`/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* =========================
   ELIMINAR
========================= */
export function eliminarCategoria(id: string): Promise<void> {
  return apiFetch(`/categorias/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   SUBIR IMAGEN
========================= */
export function subirImagenCategoria(
  id: string,
  file: File,
): Promise<CategoriaResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch(`/categorias/subir-imagen/${id}`, {
    method: "POST",
    body: formData,
  });
}
