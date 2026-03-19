// libs/api/hero.api.ts

const API_URL = "http://localhost:3000";

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
export async function getHeroSlides(type?: string): Promise<HeroSlide[]> {
  let url = `${API_URL}/hero`;

  if (type) {
    url += `?type=${type}`;
  }

  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener hero slides");
  }

  return data;
}

/* =========================
   GET POR ID
========================= */
export async function getHeroById(id: string): Promise<HeroSlide> {
  const res = await fetch(`${API_URL}/hero/${id}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener hero slide");
  }

  return data;
}

/* =========================
   CREAR SLIDE
========================= */
export async function createHeroSlide(
  formData: FormData,
): Promise<HeroResponse> {
  const res = await fetch(`${API_URL}/hero`, {
    method: "POST",
    credentials: "include",
    body: formData, // 🔥 usa multer
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al crear hero slide");
  }

  return data;
}

/* =========================
   ACTUALIZAR SLIDE
========================= */
export async function updateHeroSlide(
  id: string,
  formData: FormData,
): Promise<HeroResponse> {
  const res = await fetch(`${API_URL}/hero/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData, // 🔥 permite imagen + campos
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al actualizar hero slide");
  }

  return data;
}

/* =========================
   ACTUALIZAR ORDEN
========================= */
export async function updateHeroOrden(
  slides: { id_hero: number; orden: number }[],
): Promise<{ msg: string }> {
  const res = await fetch(`${API_URL}/hero/orden`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slides }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al actualizar orden");
  }

  return data;
}

/* =========================
   ELIMINAR
========================= */
export async function deleteHeroSlide(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/hero/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al eliminar hero slide");
  }
}
