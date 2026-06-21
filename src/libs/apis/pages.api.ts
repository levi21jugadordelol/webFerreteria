import { apiFetch } from "../../api/client";

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

export function getPaginas(): Promise<PaginaPublica[]> {
  return apiFetch("/paginas");
}

export function getPaginaBySlug(slug: string): Promise<Pagina> {
  return apiFetch(`/paginas/${slug}`);
}

export function getPaginasAdmin(): Promise<Pagina[]> {
  return apiFetch("/paginas/admin/lista");
}

export function getPaginaAdminById(id: string): Promise<Pagina> {
  return apiFetch(`/paginas/admin/${id}`);
}

export function crearPagina(data: {
  titulo: string;
  slug: string;
  contenido: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}): Promise<Pagina> {
  return apiFetch("/paginas/admin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function actualizarPagina(
  id: string,
  data: Partial<Pagina>,
): Promise<PaginaResponse> {
  return apiFetch(`/paginas/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function eliminarPagina(id: string): Promise<void> {
  return apiFetch(`/paginas/admin/${id}`, {
    method: "DELETE",
  });
}
