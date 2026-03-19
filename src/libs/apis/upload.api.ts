// libs/api/upload.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   SUBIR IMAGEN EDITOR
========================= */
export async function subirImagenEditor(file: File) {
  const formData = new FormData();

  // 🔥 IMPORTANTE: el nombre debe coincidir con multer
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

  return data; // { url }
}
