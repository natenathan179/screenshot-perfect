import { createFileRoute } from "@tanstack/react-router";
import { listPosts, listProducts } from "@/lib/catalog.functions";

const STATIC = ["", "shop", "category/peptides", "category/steroids", "category/ancillaries", "category/biotech", "category/research", "new-arrivals", "best-sellers", "blog", "reviews", "about", "contact", "faq", "shipping", "returns", "track-order", "privacy", "terms", "regulatory"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const [products, posts] = await Promise.all([listProducts(), listPosts()]);
        const subPages = [...new Set(products.filter((p) => p.category !== "research").map((p) => `/category/${p.category}?sub=${p.subcategory}`))];
        const urls = [...STATIC.map((s) => `/${s}`), ...subPages, ...products.map((p) => `/product/${p.slug}`), ...posts.map((p) => `/blog/${p.slug}`)];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${origin}${u}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
