import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/actbook/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.png",
      ],

      manifest: {
        name: "Account Book",
        short_name: "ActBook",
        description: "나만의 계정 기반 가계부",
        theme_color: "#1a1a1a",
        background_color: "#1a1a1a",
        display: "standalone",

        start_url: "/actbook/",
        scope: "/actbook/",

        icons: [
          {
            src: "/actbook/favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/actbook/favicon.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/actbook/favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
