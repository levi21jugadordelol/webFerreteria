import SiteSetting from "../models/SiteSetting.js";

export async function getSiteSettings() {
  const settings = await SiteSetting.findAll();

  const config = {};
  settings.forEach((s) => {
    config[s.key] = s.value;
  });

  return config;
}
