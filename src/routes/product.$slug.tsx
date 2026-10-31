import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, FileCheck2, FlaskConical, Heart, ShieldCheck, Truck } from "lucide-react";
import { categoryName, money, productQuery, productsQuery } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { InquiryModal } from "@/components/site/InquiryModal";
import { ProductCard, Stars } from "@/components/site/ProductCard";
import { Markdown } from "@/components/site/Markdown";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!p) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery());
    const img = [...(p.product_images ?? [])].sort((a, b) => a.position - b.position)[0]?.url;
    return { name: p.name, slug: p.slug, title: p.seo_title, desc: p.seo_description ?? p.short_description ?? p.subtitle ?? "", keywords: p.keywords, price: p.price, image: img, inStock: p.in_stock, rating: p.rating, reviews: p.review_count, sku: p.size };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product unavailable | PeptideLabs" }, { name: "robots", content: "noindex" }] };
    const t = loaderData.title ?? `${loaderData.name} for Research | ${money(loaderData.price)} | PeptideLabs`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.desc },
        ...(loaderData.keywords ? [{ name: "keywords", content: loaderData.keywords }] : []),
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${loaderData.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/product/${loaderData.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: loaderData.name,
            description: loaderData.desc,
            image: loaderData.image,
            brand: { "@type": "Brand", name: "PeptideLabs" },
            offers: { "@type": "Offer", priceCurrency: "USD", price: Number(loaderData.price).toFixed(2), availability: loaderData.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: loaderData.rating, reviewCount: loaderData.reviews },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-x py-20 text-center">
      <h1 className="text-3xl font-extrabold text-navy">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-brand underline">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(slug));
  const { data: all } = useSuspenseQuery(productsQuery());
  const { add, wishlist, toggleWish } = useCart();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const images = [...(p!.product_images ?? [])].sort((a, b) => a.position - b.position);
  const [active, setActive] = useState(0);
  if (!p) return null;
  const img = images[active]?.url ?? images[0]?.url ?? "/images/products/vial-blue.jpg";
  const main = images[0]?.url ?? img;
  const quoteOnly = p.category === "steroids" || !p.in_stock;
  const specs = (Array.isArray(p.specs) ? p.specs : []) as { label: string; value: string }[];
  const related = all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const powder = (p.form ?? "").toLowerCase().includes("powder");

  return (
    <>
      <div className="container-x py-4">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-brand">Home</Link><ChevronRight className="h-3 w-3" />
          <Link to="/category/$slug" params={{ slug: p.category }} className="hover:text-brand">{categoryName(p.category)}</Link><ChevronRight className="h-3 w-3" />
          <span className="text-navy">{p.name}</span>
        </nav>
      </div>
      <section className="container-x grid gap-10 pb-12 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            <img src={img} alt={images[active]?.alt_text ?? images[0]?.alt_text ?? p.name} width={800} height={800} className="aspect-square w-full object-contain" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((im, i) => (
                <button key={im.id} onClick={() => setActive(i)} className={`overflow-hidden rounded-md border-2 ${i === active ? "border-brand" : "border-border"}`}>
                  <img src={im.url} alt={im.alt_text ?? `${p.name} view ${i + 1}`} className="aspect-square w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{categoryName(p.category)}</p>
          <h1 className="mt-1 text-3xl font-extrabold text-navy md:text-4xl">{p.name}</h1>
          {p.subtitle && <p className="mt-1 text-lg text-charcoal">{p.subtitle}</p>}
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Stars rating={p.rating} className="h-4 w-4" />{p.rating} ({p.review_count} reviews)</div>
          <p className="mt-4 font-display text-3xl font-black text-navy">{money(p.price)}</p>
          <p className={`mt-1 text-sm font-semibold ${p.in_stock ? "text-success" : "text-destructive"}`}>{p.in_stock ? "In stock – ships in 1–2 business days" : "Out of stock – request a quote for lead time"}</p>
          <p className="mt-4 leading-relaxed text-charcoal">{p.short_description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[["Size", p.size], ["Purity", p.purity], ["Form", p.form], ["Storage", p.storage]].map(([k, v]) => (
              <div key={k} className="rounded-md bg-ice p-3"><dt className="text-xs uppercase text-muted-foreground">{k}</dt><dd className="font-semibold text-navy">{v || "—"}</dd></div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!quoteOnly && (
              <>
                <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} aria-label="Quantity" className="h-12 w-20 rounded-md border border-input px-3" />
                <button onClick={() => { add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), size: p.size, image: main }, qty); toast.success(`${p.name} added to cart`); }} className="h-12 flex-1 rounded-md bg-primary px-6 font-semibold text-primary-foreground hover:bg-navy-deep">Add to Cart</button>
              </>
            )}
            <button onClick={() => setOpen(true)} className="h-12 flex-1 rounded-md bg-brand px-6 font-semibold text-accent-foreground hover:opacity-90">Request Quote</button>
            <button onClick={() => toggleWish(p.slug)} aria-label="Toggle wishlist" className="grid h-12 w-12 place-items-center rounded-md border border-border"><Heart className={`h-5 w-5 ${wishlist.includes(p.slug) ? "fill-brand text-brand" : "text-navy"}`} /></button>
          </div>
          {quoteOnly && <p className="mt-3 rounded-md bg-muted p-3 text-xs text-muted-foreground">This product is supplied on a quote basis only. Our compliance team will verify eligibility for your jurisdiction before confirming an order.</p>}
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-charcoal sm:grid-cols-4">
            {[[FlaskConical, "3rd-party tested"], [FileCheck2, "COA included"], [Truck, "Discreet shipping"], [ShieldCheck, "Secure inquiry"]].map(([I, t]) => { const Icon = I as typeof Truck; return <span key={t as string} className="flex items-center gap-1.5"><Icon className="h-4 w-4 text-brand" />{t as string}</span>; })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-extrabold text-navy">Product Description</h2>
            <div className="mt-4"><Markdown text={p.description ?? ""} /></div>
            <div className="prose-lab">
              <h2>Quality & Testing</h2>
              <p>Each lot of {p.name} is verified by HPLC for purity and mass spectrometry for identity. Our minimum release specification is {p.purity ?? "batch dependent"}. Chromatograms, lot numbers and the full Certificate of Analysis are available on request through the quote form.</p>
              <h2>Handling & Storage</h2>
              <p>{powder ? "Store lyophilised powder at -20°C, protected from light and moisture. Allow the vial to reach room temperature before opening. Once reconstituted with bacteriostatic water, store at 2–8°C and use within the timeframe defined by your protocol." : `Store at ${p.storage ?? "controlled room temperature"}. Keep the container tightly closed and away from direct light and heat sources.`}</p>
              <h2>Ordering & Availability</h2>
              <p>Prices are indicative. Submit an inquiry to receive a formal quote, regional availability and lead time. We ship to the United States, United Kingdom, Europe and international markets where the product may legally be supplied.</p>
              <h2>Compliance Notice</h2>
              <p>For laboratory research use only. Not for human or veterinary use and not a medicine, food or cosmetic. Prescription-only and controlled substances are supplied only to appropriately licensed and authorised buyers.</p>
            </div>
          </div>
          <aside>
            <div className="rounded-lg bg-background p-5 shadow-card">
              <h2 className="text-lg font-extrabold text-navy">Specifications</h2>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {specs.map((s) => (
                    <tr key={s.label} className="border-b border-border last:border-0"><th className="py-2 pr-3 text-left font-medium text-muted-foreground">{s.label}</th><td className="py-2 font-semibold text-navy">{s.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-12">
          <h2 className="mb-6 text-2xl font-extrabold uppercase text-navy">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
      <InquiryModal open={open} onOpenChange={setOpen} mode="quote" items={[{ name: p.name, size: p.size, price: Number(p.price), qty, image: main, slug: p.slug, purity: p.purity }]} />
    </>
  );
}
