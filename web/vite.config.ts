import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const catalog = process.env.CATALOG_PROXY || "http://127.0.0.1:8081";

export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Explore — OPEN",
        short_name: "Explore",
        description: "A directory of places across Ireland",
        theme_color: "#215C4E",
        background_color: "#F4F0E6",
        display: "standalone",
        start_url: ".",
        icons: [
          { src: "favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,ico,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /\/api\/v1\/(places|categories|counties)/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "catalog-api" },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    // GIS on http://localhost: Google docs want no-referrer-when-downgrade (not no-referrer).
    headers: {
      "Referrer-Policy": "no-referrer-when-downgrade",
    },
    proxy: {
      "/api": { target: catalog, changeOrigin: true },
    },
  },
  test: {
    environment: "node",
  },
});
