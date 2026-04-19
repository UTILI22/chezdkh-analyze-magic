import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const SITE = "https://chezdkh-analyze-magic.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        type SitemapUrl = { loc: string; changefreq: string; priority: string; lastmod?: string };
        const staticUrls: SitemapUrl[] = [
          { loc: `${SITE}/`, changefreq: "weekly", priority: "1.0" },
          { loc: `${SITE}/burkinis`, changefreq: "weekly", priority: "0.9" },
          { loc: `${SITE}/contact`, changefreq: "monthly", priority: "0.6" },
        ];

        let productUrls: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [];
        try {
          const { data } = await supabase
            .from("products")
            .select("slug, id, updated_at")
            .eq("active", true);
          productUrls = (data ?? []).map((p) => ({
            loc: `${SITE}/product/${p.slug ?? p.id}`,
            changefreq: "weekly",
            priority: "0.8",
            lastmod: (p as { updated_at?: string }).updated_at,
          }));
        } catch (e) {
          console.error("sitemap products fetch failed", e);
        }

        const all = [...staticUrls, ...productUrls];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
