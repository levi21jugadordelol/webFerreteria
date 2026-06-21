import { defineConfig } from "astro/config";
import astroIcon from "astro-icon";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),

  integrations: [astroIcon()],

  vite: {
    server: {
      proxy: {
        "/auth": {
          target: "http://localhost:3000/api/v1",
          changeOrigin: true,
        },
        "/api": {
          target: "http://localhost:3000/api/v1",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  },
});
