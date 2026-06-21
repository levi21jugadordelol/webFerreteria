// src/libs/apis/upload.api.ts

import { API_URL } from "../../config/api";

export async function subirImagenEditor(file: File) {
  const formData = new FormData();
  formData.append("imagen", file);

  const res = await fetch(`${API_URL}/upload/editor`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al subir imagen");
  }

  return data;
}
