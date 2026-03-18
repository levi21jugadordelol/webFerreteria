import SiteSetting from "./settings.model.js";
import logger from "../../shared/logger/logger.js";

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
