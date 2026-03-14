import SiteSetting from "../models/SiteSetting.js";

export async function getSiteSettings() {
  const settings = await SiteSetting.findAll({ raw: true });

  return settings.reduce((acc, s) => {
    try {
      acc[s.key] = JSON.parse(s.value);
    } catch {
      acc[s.key] = s.value;
    }
    return acc;
  }, {});
}
