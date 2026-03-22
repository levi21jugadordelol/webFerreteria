// controllers/siteSettings.controller.js

import logger from "../../shared/logger/logger.js";
import {
  getSiteSettings,
  getSettingByKey,
  updateSettings,
} from "../settings/settings.services.js";

/* 🟢 GET /api/site-settings
   🟢 GET /api/site-settings?key=footer */
export const getSiteSettingsController = async (req, res) => {
  try {
    const { key } = req.query;

    if (key) {
      const setting = await getSettingByKey(key);
      return res.json(setting || {});
    }

    const settings = await getSiteSettings();
    return res.json(settings);
  } catch (error) {
    logger.error({
      message: "Error obteniendo site settings",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al cargar configuración",
    });
  }
};

/* 🔒 PUT /api/site-settings */
export const updateSiteSettingsController = async (req, res) => {
  try {
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        msg: "Datos inválidos",
      });
    }

    await updateSettings(data);

    return res.json({
      msg: "Configuración actualizada correctamente",
    });
  } catch (error) {
    logger.error({
      message: "Error actualizando site settings",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al actualizar configuración",
    });
  }
};
