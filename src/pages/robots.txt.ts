import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://417-tech.com/");
  const sitemapUrl = new URL("/sitemap-index.xml", base);

  return new Response(
    ["User-agent: *", "Allow: /", `Sitemap: ${sitemapUrl.href}`].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
