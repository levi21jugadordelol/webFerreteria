// controllers/siteSettings.controller.js
import logger from "../../shared/logger/logger.js";
import SiteSetting from "../../modules/settings/settings.model.js";

/* ──────────────────────────────
   🟢 GET /api/site-settings
────────────────────────────── */
export const getSiteSettings = async (req, res) => {
  try {
    const records = await SiteSetting.findAll();

    const settings = {};

    records.forEach((record) => {
      try {
        settings[record.key] = JSON.parse(record.value);
      } catch (err) {
        logger.warn({
          message: "Error parsing site_setting",
          key: record.key,
        });
      }
    });

    logger.info({
      message: "Site settings enviados",
      total: Object.keys(settings).length,
    });

    return res.json(settings);
  } catch (error) {
    logger.error({
      message: "Error obteniendo site settings",
      error: error.message,
    });

    return res.status(500).json({
      msg: "Error al cargar configuración del sitio",
    });
  }
};

/* ──────────────────────────────
   🔒 PUT /api/site-settings
   (POST-PMV)
────────────────────────────── */
export const updateSiteSettings = async (req, res) => {
  try {
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        msg: "Datos inválidos",
      });
    }

    for (const key of Object.keys(data)) {
      await SiteSetting.upsert({
        key,
        value: JSON.stringify(data[key]),
      });
      logger.info({
        message: "Guardando setting",
        key,
      });
    }

    logger.info({
      message: "Site settings actualizados",
    });

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
