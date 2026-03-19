// libs/api/pages.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type Pagina = {
  id_pagina: number;
  titulo: string;
  slug: string;
  contenido: string;
  activo: boolean;
};

type PaginaPublica = {
  titulo: string;
  slug: string;
};

type PaginaResponse = {
  msg?: string;
};

/* =========================
   LISTAR PÁGINAS (PUBLICO)
========================= */
export async function getPaginas(): Promise<PaginaPublica[]> {
  const res = await fetch(`${API_URL}/paginas`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al listar páginas");
  }

  return data;
}

/* =========================
   OBTENER PÁGINA POR SLUG
========================= */
export async function getPaginaBySlug(slug: string): Promise<Pagina> {
  const res = await fetch(`${API_URL}/paginas/${slug}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Página no encontrada");
  }

  return data;
}

/* =========================
   ADMIN: LISTAR TODAS
========================= */
export async function getPaginasAdmin(): Promise<Pagina[]> {
  const res = await fetch(`${API_URL}/paginas/admin/lista`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al listar páginas admin");
  }

  return data;
}

/* =========================
   ADMIN: OBTENER POR ID
========================= */
export async function getPaginaAdminById(id: string): Promise<Pagina> {
  const res = await fetch(`${API_URL}/paginas/admin/${id}`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener página");
  }

  return data;
}

/* =========================
   ADMIN: CREAR
========================= */
export async function crearPagina(data: {
  titulo: string;
  slug: string;
  contenido: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}): Promise<Pagina> {
  const res = await fetch(`${API_URL}/paginas/admin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al crear página");
  }

  return result;
}

/* =========================
   ADMIN: ACTUALIZAR
========================= */
export async function actualizarPagina(
  id: string,
  data: Partial<Pagina>,
): Promise<PaginaResponse> {
  const res = await fetch(`${API_URL}/paginas/admin/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al actualizar página");
  }

  return result;
}

/* =========================
   ADMIN: ELIMINAR
========================= */
export async function eliminarPagina(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/paginas/admin/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al eliminar página");
  }
}
