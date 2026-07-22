import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
