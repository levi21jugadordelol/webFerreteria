import { safeJson } from "../utils/helpers.js";

export async function obtenerCategorias(apiUrl) {
  const res = await fetch(`${apiUrl}/categorias`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al cargar categorías");

  return res.json();
}

export async function obtenerMarcas(apiUrl) {
  const res = await fetch(`${apiUrl}/marcas`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al cargar marcas");

  return res.json();
}

export async function crearProducto(apiUrl, formData) {
  const res = await fetch(`${apiUrl}/productos/admin`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(data.msg || "Error al crear producto");
  }

  return data;
}
