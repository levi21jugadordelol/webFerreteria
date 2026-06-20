import asyncHandler from "../../shared/utils/asyncHandler.js";

import {
  getSiteSettings,
  getSettingByKey,
  updateSettings,
} from "../settings/settings.services.js";

import logger from "../../shared/logger/logger.js";

export const getSiteSettingsController = asyncHandler(async (req, res) => {
  const { key } = req.query;

  const data = key ? await getSettingByKey(key) : await getSiteSettings();

  return res.success({
    data: data || {},
  });
});

export const updateSiteSettingsController = asyncHandler(async (req, res) => {
  await updateSettings(req.body);

  logger.info({
    event: "SETTINGS_UPDATED",
    adminId: req.admin?.id_administrador,
    keys: Object.keys(req.body || {}),
  });

  return res.success({
    message: "Configuración actualizada correctamente",
  });
});
