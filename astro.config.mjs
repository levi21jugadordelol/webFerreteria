import { defineConfig } from "astro/config";
import astroIcon from "astro-icon"; // 👈 importante

export default defineConfig({
  output: "server", // 🔥 ACTIVAR SSR
  integrations: [astroIcon()],
});
