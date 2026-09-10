import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import { readFileSync, cpSync } from "node:fs";
import { fileURLToPath } from "node:url";

const site = process.env.SITE_URL || "https://417-tech.com/";

// Publishes src/scripts/*.js at /scripts/*.js (dev + build) without a public/ copy.
// These are plain <script src> files (not Astro-hoisted) so the built site
// has a stable, non-hashed URL that satisfies the `script-src 'self'` CSP.
function publishScripts() {
  const srcDir = fileURLToPath(new URL("./src/scripts/", import.meta.url));
  return {
    name: "publish-scripts",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/scripts\/([\w-]+\.js)$/);
        if (!match) return next();
        try {
          res.setHeader("Content-Type", "text/javascript");
          res.end(readFileSync(srcDir + match[1]));
        } catch {
          next();
        }
      });
    },
    closeBundle() {
      cpSync(
        srcDir,
        fileURLToPath(new URL("./dist/scripts/", import.meta.url)),
        { recursive: true },
      );
    },
  };
}

// Tailwind v4 via the Vite plugin — no separate integration/config file needed.
// Default (sharp) image service — images live in src/assets and are optimised by <Image>.
// Icons: astro-icon inlines Iconify SVGs at build time — no runtime JS, no CDN calls.
// Every icon on the site comes from the Lucide set (@iconify-json/lucide) — one library.
export default defineConfig({
  site,
  vite: { plugins: [tailwind(), publishScripts()] },
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
