// controllers/siteSettings.controller.js
import chalk from "chalk";
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
        console.error(
          chalk.red(`❌ Error parsing site_setting: ${record.key}`),
        );
      }
    });

    console.log(
      chalk.green(
        `⚙️ Site settings enviados (${Object.keys(settings).length})`,
      ),
    );

    return res.json(settings);
  } catch (error) {
    console.error(chalk.red("❌ Error obteniendo site settings"), error);

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
      console.log(chalk.blue(`⚙️ Guardando setting → ${key}`), data[key]);
    }

    console.log(chalk.yellow(`📝 Site settings actualizados por admin`));

    return res.json({
      msg: "Configuración actualizada correctamente",
    });
  } catch (error) {
    console.error(chalk.red("❌ Error actualizando site settings"), error);

    return res.status(500).json({
      msg: "Error al actualizar configuración",
    });
  }
};
