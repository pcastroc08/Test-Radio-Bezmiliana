import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import programas from "@/data/programas.json";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/programas", changefreq: "weekly", priority: "0.9" },
          { path: "/noticias", changefreq: "weekly", priority: "0.8" },
          { path: "/equipo", changefreq: "monthly", priority: "0.6" },
          { path: "/galeria", changefreq: "monthly", priority: "0.6" },
          { path: "/documentos", changefreq: "monthly", priority: "0.5" },
          { path: "/contacto", changefreq: "monthly", priority: "0.7" },
        ];

        const programaEntries: SitemapEntry[] = (programas as Array<{ slug: string }>).map((p) => ({
          path: `/programas/${p.slug}`,
          changefreq: "weekly",
          priority: "0.8",
        }));

        const all = [...staticEntries, ...programaEntries];

        const urls = all.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
