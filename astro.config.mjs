import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined;
const noindexValue = process.env.SITE_NOINDEX;
const noindexSite = noindexValue === "true";

if (noindexValue && !["true", "false"].includes(noindexValue)) {
  throw new Error("SITE_NOINDEX must be either true or false when defined.");
}

if (
  site &&
  (site.protocol !== "https:" ||
    site.pathname !== "/" ||
    site.search ||
    site.hash ||
    site.username ||
    site.password)
) {
  throw new Error("SITE_URL must be an HTTPS origin without a path, query, or credentials.");
}

export default defineConfig({
  ...(site && { site: site.origin }),
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'none'",
        "frame-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "media-src 'self'",
        "connect-src 'none'",
        "manifest-src 'self'",
        "worker-src 'none'",
      ],
    },
  },
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    mdx(),
    ...(site && !noindexSite
      ? [
          sitemap({
            filter: (page) => new URL(page).pathname !== "/404.html",
          }),
        ]
      : []),
  ],
  vite: {
    define: {
      __SITE_NOINDEX__: JSON.stringify(noindexSite),
    },
    plugins: [tailwindcss()],
  },
});
