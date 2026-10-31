import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, FileCheck2, FlaskConical, Headphones, Lock, ShieldCheck, Truck } from "lucide-react";
import { CATEGORIES, postsQuery, productsQuery } from "@/lib/queries";
import { ProductCard } from "@/components/site/ProductCard";
import { seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "PeptideLabs | Research Peptides, Steroid Reference Compounds & Biotech Products",
      "Buy third-party tested research peptides (BPC-157, semaglutide, tirzepatide), steroid reference compounds and biotech products with batch COAs. Worldwide discreet shipping.",
    ),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(productsQuery()), context.queryClient.ensureQueryData(postsQuery())]),
  component: Home,
});

function SectionTitle({ title, sub, to }: { title: string; sub?: string; to?: string }) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl font-extrabold uppercase text-navy md:text-3xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {to && (
        <Link to={to} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: posts } = useSuspenseQuery(postsQuery());
  const featured = products.filter((p) => p.is_featured).slice(0, 5);
  const best = products.filter((p) => p.is_bestseller).slice(0, 5);
  const fresh = products.filter((p) => p.is_new).slice(0, 5);

  return (
    <>
      <section className="relative overflow-hidden bg-ice">
        <img src="/images/hero.jpg" alt="PeptideLabs high-purity research peptide vial" width={1920} height={912} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative container-x py-16 md:py-24">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand">Premium Peptides & Research Compounds</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-[1.02] text-navy md:text-6xl">
            High Quality Products for Research & Performance
          </h1>
          <p className="mt-5 max-w-xl text-lg text-charcoal">
            Trusted source for peptides, steroid reference compounds and biotechnology products. Quality. Purity. Results.
          </p>
          <div className="mt-6 flex max-w-2xl flex-wrap gap-x-6 gap-y-3 text-sm text-navy">
            {[[FlaskConical, "Lab Tested Products"], [Truck, "Worldwide Shipping"], [Lock, "Secure Inquiries"], [ShieldCheck, "Discreet Packaging"]].map(([I, t]) => {
              const Icon = I as typeof Truck;
              return (
                <span key={t as string} className="flex items-center gap-2"><Icon className="h-5 w-5 text-brand" />{t as string}</span>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/category/$slug" params={{ slug: "peptides" }} className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 font-semibold text-accent-foreground shadow-card hover:opacity-90">Shop Peptides <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/category/$slug" params={{ slug: "steroids" }} className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-navy bg-background/70 px-7 font-semibold text-navy hover:bg-background">Shop Steroids <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group overflow-hidden rounded-lg border border-border bg-ice transition-shadow hover:shadow-card">
            <img src={c.image} alt={c.name} loading="lazy" width={1088} height={608} className="aspect-[16/8] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="p-5">
              <h3 className="text-xl font-extrabold uppercase text-navy">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Shop {c.name} <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        ))}
      </section>

      <section className="container-x py-6">
        <SectionTitle title="Featured Products" sub="Top quality products, trusted by researchers worldwide." to="/shop" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="container-x py-12">
        <div className="grid gap-6 rounded-xl bg-ice p-6 md:p-10 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <h2 className="text-2xl font-extrabold uppercase text-navy">Quality You Can Trust</h2>
            <p className="mt-3 text-sm text-charcoal">Every product is tested for purity, potency and authenticity. Strict quality control standards ensure reproducible research outcomes.</p>
            <Link to="/about" className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Learn more <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {[
            [FlaskConical, "Third-Party Lab Tested", "All products are independently tested for purity and potency."],
            [FileCheck2, "Certificate of Analysis", "Detailed COA available for every batch we release."],
            [Truck, "Secure & Discreet Shipping", "Packed securely and shipped worldwide where permitted."],
            [Headphones, "Dedicated Support", "Our scientific team is here to answer your questions."],
          ].map(([I, t, d]) => {
            const Icon = I as typeof Truck;
            return (
              <div key={t as string} className="text-center lg:border-l lg:border-border lg:pl-6">
                <Icon className="mx-auto h-10 w-10 text-navy" strokeWidth={1.5} />
                <h3 className="mt-3 font-bold text-navy">{t as string}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-x grid gap-5 md:grid-cols-2">
        {[
          { t: "New Arrivals", d: "Latest products added to our catalogue.", to: "/new-arrivals" as const },
          { t: "Best Sellers", d: "Our most requested research products.", to: "/best-sellers" as const },
        ].map((b) => (
          <Link key={b.t} to={b.to} className="relative overflow-hidden rounded-xl bg-ice p-8">
            <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-right opacity-60" loading="lazy" />
            <div className="absolute inset-0 bg-hero-fade" />
            <div className="relative">
              <h2 className="text-2xl font-extrabold uppercase text-navy">{b.t}</h2>
              <p className="mt-1 text-sm text-charcoal">{b.d}</p>
              <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Shop {b.t} <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        ))}
      </section>

      <section className="container-x py-12">
        <SectionTitle title="Best Sellers" sub="Most requested by laboratories this month." to="/best-sellers" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{best.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="container-x pb-12">
        <SectionTitle title="New Arrivals" sub="Freshly released batches with full documentation." to="/new-arrivals" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{fresh.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="container-x grid gap-10 border-t border-border py-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-brand">About PeptideLabs</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy">Science. Quality. Performance.</h2>
          <p className="mt-3 text-charcoal">
            PeptideLabs supplies high-purity peptides, reference compounds and biotechnology products to researchers in the United States, United Kingdom, Europe and international markets where legally permitted. We combine rigorous analytical testing with transparent documentation and responsive scientific support.
          </p>
          <p className="mt-3 text-charcoal">Need help choosing a product or documentation? Our support team replies within one business day.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/about" className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Learn more <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/contact" className="inline-flex items-center gap-1 rounded-full border border-navy px-5 py-2 text-sm font-semibold text-navy">Contact support</Link>
          </div>
        </div>
        <div>
          <SectionTitle title="Latest Articles" to="/blog" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {posts.slice(0, 4).map((p) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="overflow-hidden rounded-lg border border-border hover:shadow-card">
                <img src={p.cover_url ?? "/images/lab.jpg"} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-bold text-brand">{p.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{new Date(p.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
