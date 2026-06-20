import { apiFetch } from "../../api/client";

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
   OBTENER SETTINGS
========================= */
export function getSiteSettings(): Promise<SiteSettings> {
  return apiFetch("/site-settings");
}

/* =========================
   ACTUALIZAR SETTINGS
========================= */
export function updateSiteSettings(
  data: SiteSettings,
): Promise<SettingsResponse> {
  return apiFetch("/site-settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
