import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { reviewsQuery } from "@/lib/queries";
import { Stars } from "@/components/site/ProductCard";
import { PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/reviews")({
  head: () => seo("Customer Reviews | PeptideLabs Ratings & Testimonials", "Read verified reviews from researchers and laboratories who source peptides, reference compounds and lab supplies from PeptideLabs."),
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQuery()),
  component: Reviews,
});

function Reviews() {
  const { data } = useSuspenseQuery(reviewsQuery());
  const avg = data.length ? data.reduce((s, r) => s + r.rating, 0) / data.length : 0;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: data.filter((r) => r.rating === n).length }));
  return (
    <>
      <PageHero title="Customer Reviews" subtitle="What researchers say about our products, documentation and support." />
      <div className="container-x py-12">
        <div className="grid gap-8 rounded-xl bg-ice p-8 md:grid-cols-[auto_minmax(0,1fr)]">
          <div className="text-center">
            <p className="font-display text-6xl font-black text-navy">{avg.toFixed(1)}</p>
            <div className="mt-2 flex justify-center"><Stars rating={avg} className="h-5 w-5" /></div>
            <p className="mt-1 text-sm text-muted-foreground">{data.length} reviews</p>
          </div>
          <div className="space-y-2">
            {dist.map((d) => (
              <div key={d.n} className="flex items-center gap-3 text-sm">
                <span className="w-10">{d.n} star</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-background"><div className="h-full bg-star" style={{ width: `${data.length ? (d.c / data.length) * 100 : 0}%` }} /></div>
                <span className="w-8 text-right text-muted-foreground">{d.c}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 columns-1 gap-5 md:columns-2 lg:columns-3">
          {data.map((r) => (
            <figure key={r.id} className="mb-5 break-inside-avoid rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <img src={r.avatar_url ?? ""} alt={r.name} loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1 font-semibold text-navy">{r.name}<BadgeCheck className="h-4 w-4 text-brand" /></p>
                  <p className="text-xs text-muted-foreground">{r.location}</p>
                </div>
              </div>
              <div className="mt-3"><Stars rating={r.rating} /></div>
              {r.title && <p className="mt-2 font-bold text-navy">{r.title}</p>}
              <blockquote className="mt-1 text-sm leading-relaxed text-charcoal">{r.body}</blockquote>
              <figcaption className="mt-3 text-xs text-muted-foreground">{r.product_name && `Purchased: ${r.product_name} • `}{new Date(r.created_at).toLocaleDateString()}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
