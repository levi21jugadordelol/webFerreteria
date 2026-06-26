import { safeJson } from "../utils/helpers.js";

/* =========================
   CATEGORIAS
========================= */
export async function obtenerCategorias(apiUrl) {
  const res = await fetch(`${apiUrl}/categorias`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al cargar categorías");

  const result = await res.json();
  return result.data; // 🔥 CAMBIO
}

/* =========================
   MARCAS
========================= */
export async function obtenerMarcas(apiUrl) {
  const res = await fetch(`${apiUrl}/marcas`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al cargar marcas");

  const result = await res.json();
  return result.data; // 🔥 CAMBIO
}

/* =========================
   PRODUCTO
========================= */
export async function crearProducto(apiUrl, formData) {
  const res = await fetch(`${apiUrl}/productos/admin`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const detalle = Array.isArray(data.errores)
      ? data.errores.map((e) => `${e.campo}: ${e.mensaje}`).join(" | ")
      : null;

    throw new Error(
      detalle || data.message || data.msg || "Error al crear producto",
    );
  }

  return data;
}
