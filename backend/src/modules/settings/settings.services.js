// services/settings.service.js

import SiteSetting from "./settings.model.js";
import logger from "../../shared/logger/logger.js";

/* 🟢 Obtener TODOS los settings */
export async function getSiteSettings() {
  const settings = await SiteSetting.findAll({ raw: true });

  return settings.reduce((acc, s) => {
    try {
      acc[s.key] = JSON.parse(s.value);
    } catch (error) {
      logger.warn({
        message: "Error parsing site setting",
        key: s.key,
      });
      acc[s.key] = s.value;
    }
    return acc;
  }, {});
}

/* 🟢 Obtener UNO (ej: footer) */
export async function getSettingByKey(key) {
  const setting = await SiteSetting.findOne({ where: { key }, raw: true });

  if (!setting) return null;

  try {
    return JSON.parse(setting.value);
  } catch {
    return setting.value;
  }
}

/* 🔒 Guardar settings */
export async function updateSettings(data) {
  for (const key of Object.keys(data)) {
    await SiteSetting.upsert({
      key,
      value: JSON.stringify(data[key]),
    });
  }
}
