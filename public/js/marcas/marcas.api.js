import { safeJson } from "../utils/helpers.js";

export async function obtenerMarcas(apiUrl) {
  const res = await fetch(`${apiUrl}/marcas`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al cargar marcas");

  return res.json();
}

export async function crearMarca(apiUrl, payload) {
  const res = await fetch(`${apiUrl}/marcas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(data.msg || "Error al crear marca");
  }

  return data;
}

export async function subirLogoMarca(apiUrl, marcaId, archivo) {
  const formData = new FormData();
  formData.append("file", archivo);

  const res = await fetch(`${apiUrl}/marcas/subir-logo/${marcaId}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(data.msg || "Error al subir logo");
  }

  return data;
}
