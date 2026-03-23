import { safeJson } from "../utils/helpers.js";

export async function obtenerCategorias(apiUrl) {
  const res = await fetch(`${apiUrl}/categorias`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al cargar categorías");

  return res.json();
}

export async function crearCategoria(apiUrl, payload) {
  const res = await fetch(`${apiUrl}/categorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await safeJson(res);

  if (!res.ok) throw new Error(data.msg || "Error");

  return data;
}
