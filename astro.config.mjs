import { defineConfig } from "astro/config";
import astroIcon from "astro-icon";

export default defineConfig({
  output: "server",
  integrations: [astroIcon()],
  vite: {
    server: {
      proxy: {
        "/auth": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  },
});
