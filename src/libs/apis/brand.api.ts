import { apiFetch } from "../../api/client";

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
export function crearMarca(data: {
  nombre_marca: string;
  descripcion: string;
}): Promise<MarcaResponse> {
  return apiFetch("/marcas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   LISTAR MARCAS
========================= */
export function getMarcas(): Promise<Marca[]> {
  return apiFetch("/marcas");
}

/* =========================
   OBTENER POR ID
========================= */
export function getMarcaById(id: string): Promise<Marca> {
  return apiFetch(`/marcas/${id}`);
}

/* =========================
   ACTUALIZAR
========================= */
export function actualizarMarca(
  id: string,
  data: Partial<Marca>,
): Promise<MarcaResponse> {
  return apiFetch(`/marcas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* =========================
   ELIMINAR
========================= */
export function eliminarMarca(id: string): Promise<void> {
  return apiFetch(`/marcas/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   SUBIR LOGO
========================= */
export function subirLogoMarca(id: string, file: File): Promise<MarcaResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch(`/marcas/subir-logo/${id}`, {
    method: "POST",
    body: formData,
  });
}
