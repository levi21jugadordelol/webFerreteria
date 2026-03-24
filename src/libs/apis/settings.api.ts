// libs/api/settings.api.ts

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
  const res = await fetch("/api/site-settings"); // ✅ proxy + ruta correcta

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
  const res = await fetch("/api/site-settings", {
    // ✅ igual aquí
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
