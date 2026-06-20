import SiteSetting from "./settings.model.js";
import logger from "../../shared/logger/logger.js";
import AppError from "../../shared/utils/AppError.js";

import { SETTINGS_KEYS_PERMITIDAS } from "./settings.keys.js";

import sanitizeHtml from "sanitize-html";

const sanitizarTexto = (valor) => {
  return sanitizeHtml(String(valor || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};

const sanitizarObjeto = (obj) => {
  if (typeof obj === "string") {
    return sanitizarTexto(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizarObjeto);
  }

  if (obj && typeof obj === "object") {
    const limpio = {};

    for (const [key, value] of Object.entries(obj)) {
      limpio[key] = sanitizarObjeto(value);
    }

    return limpio;
  }

  return obj;
};

/* 🟢 Obtener TODOS los settings */
export async function getSiteSettings() {
  try {
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
  } catch (error) {
    logger.error({
      message: "Error en getSiteSettings",
      error: error.message,
    });

    throw new AppError("Error obteniendo configuración", 500);
  }
}

/* 🟢 Obtener UNO */
export async function getSettingByKey(key) {
  try {
    if (!key) {
      throw new AppError("Key requerida", 400);
    }

    const setting = await SiteSetting.findOne({
      where: { key },
      raw: true,
    });

    if (!setting) return null;

    try {
      return JSON.parse(setting.value);
    } catch {
      return setting.value;
    }
  } catch (error) {
    logger.error({
      message: "Error en getSettingByKey",
      error: error.message,
    });

    if (error instanceof AppError) throw error;

    throw new AppError("Error obteniendo configuración", 500);
  }
}

/* 🔒 Actualizar settings */
export async function updateSettings(data) {
  try {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("Datos inválidos", 400);
    }

    const entries = Object.entries(data).filter(([key]) =>
      SETTINGS_KEYS_PERMITIDAS.includes(key),
    );

    if (!entries.length) {
      throw new AppError("No hay configuraciones válidas para actualizar", 400);
    }

    const sanitizedEntries = entries.map(([key, value]) => [
      key,
      sanitizarObjeto(value),
    ]);

    await Promise.all(
      sanitizedEntries.map(([key, value]) =>
        SiteSetting.upsert({
          key,
          value: JSON.stringify(value),
        }),
      ),
    );

    logger.info({
      message: "Site settings updated",
      keys: sanitizedEntries.map(([key]) => key),
    });

    return true;
  } catch (error) {
    logger.error({
      message: "Error en updateSettings",
      error: error.message,
    });

    if (error instanceof AppError) throw error;

    throw new AppError("Error actualizando configuración", 500);
  }
}
