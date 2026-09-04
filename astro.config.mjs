import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

const site = process.env.SITE_URL || "https://417-tech.netlify.app/";

// Tailwind v4 via the Vite plugin — no separate integration/config file needed.
// Default (sharp) image service — images live in src/assets and are optimised by <Image>.
// Icons: astro-icon inlines Iconify SVGs at build time — no runtime JS, no CDN calls.
// Every icon on the site comes from the Lucide set (@iconify-json/lucide) — one library.
export default defineConfig({
  site,
  vite: { plugins: [tailwind()] },
  integrations: [
    icon(),
    // Archived legal versions stay crawlable via canonical tags but shouldn't compete with the current version in search.
    sitemap({
      filter: (page) =>
        !/\/legal\/[^/]+\/v[^/]+\/?$/.test(new URL(page).pathname),
      xslURL: "/sitemap.xsl",
    }),
  ],
});
