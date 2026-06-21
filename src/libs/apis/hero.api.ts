// src/libs/apis/hero.api.ts

import { apiFetch } from "../../api/client";

/* =========================
   TIPOS
========================= */
type HeroSlide = {
  id_hero: number;
  titulo1: string | null;
  titulo2: string | null;
  imagen: string;
  tipo_layout: string;
  mostrar_boton: boolean;
  boton_texto: string | null;
  boton_url: string | null;
  link_url: string | null;
  activo: boolean;
  orden: number;
};

type HeroResponse = {
  msg: string;
  slide?: HeroSlide;
};

/* =========================
   GET PUBLICO (con filtros)
========================= */
export function getHeroSlides(type?: string): Promise<HeroSlide[]> {
  const params = new URLSearchParams();

  if (type) {
    params.append("type", type);
  }

  const query = params.toString();

  return apiFetch(`/hero${query ? `?${query}` : ""}`);
}

/* =========================
   GET POR ID
========================= */
export function getHeroById(id: string): Promise<HeroSlide> {
  return apiFetch(`/hero/${id}`);
}

/* =========================
   CREAR SLIDE
========================= */
export function createHeroSlide(formData: FormData): Promise<HeroResponse> {
  return apiFetch(`/hero`, {
    method: "POST",
    body: formData,
  });
}

/* =========================
   ACTUALIZAR SLIDE
========================= */
export function updateHeroSlide(
  id: string,
  formData: FormData,
): Promise<HeroResponse> {
  return apiFetch(`/hero/${id}`, {
    method: "PUT",
    body: formData,
  });
}

/* =========================
   ACTUALIZAR ORDEN
========================= */
export function updateHeroOrden(
  slides: { id_hero: number; orden: number }[],
): Promise<{ msg: string }> {
  return apiFetch(`/hero/orden`, {
    method: "PUT",
    body: JSON.stringify({ slides }),
  });
}

/* =========================
   ELIMINAR
========================= */
export function deleteHeroSlide(id: string): Promise<void> {
  return apiFetch(`/hero/${id}`, {
    method: "DELETE",
  });
}
