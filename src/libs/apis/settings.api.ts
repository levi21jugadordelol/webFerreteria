// libs/api/settings.api.ts

const API_URL = "http://localhost:3000";

/* =========================
   TIPOS
========================= */
type SiteSettings = {
  [key: string]: any;
};

type SettingsResponse = {
  msg: string;
};

/* =========================
   OBTENER SETTINGS (PUBLICO)
========================= */
export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_URL}/site-settings`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error al obtener configuración");
  }

  return data;
}

/* =========================
   ACTUALIZAR SETTINGS (ADMIN)
========================= */
export async function updateSiteSettings(
  data: SiteSettings,
): Promise<SettingsResponse> {
  const res = await fetch(`${API_URL}/site-settings`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.msg || "Error al actualizar configuración");
  }

  return result;
}
