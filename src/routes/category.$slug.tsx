import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CATEGORIES, productsQuery } from "@/lib/queries";
import { Catalog } from "@/components/site/Catalog";
import { PageHero } from "@/components/site/PageHero";

const EXTRA: Record<string, { h: string; p: string }[]> = {
  peptides: [
    { h: "What are research peptides?", p: "Peptides are short chains of amino acids (typically 2–50 residues) that act as signalling molecules. Researchers use them to study tissue repair, metabolism, growth hormone release, skin biology and more." },
    { h: "How we verify every peptide", p: "Each batch is analysed by reverse-phase HPLC for purity and by LC-MS for molecular identity. Net peptide content and endotoxin data are available on request." },
    { h: "Storage", p: "Keep lyophilised peptides at -20°C, dry and away from light. Reconstitute with bacteriostatic water and refrigerate at 2–8°C." },
  ],
  steroids: [
    { h: "Regulatory eligibility", p: "Anabolic steroids are Schedule III controlled substances in the US, Class C in the UK and prescription-only across the EU. We only supply verified, licensed buyers where permitted." },
    { h: "Reference standards", p: "Our steroid compounds are intended as analytical reference materials for chromatography, toxicology screening and pharmacology studies." },
    { h: "Quote-only ordering", p: "Products in this category cannot be added to cart. Submit a quote request and our compliance team will review your documentation." },
  ],
  biotech: [
    { h: "Cold-chain handling", p: "Growth factors and glycoprotein hormones are shipped with temperature control to protect bioactivity." },
    { h: "Applications", p: "Common uses include cell culture supplementation, receptor binding assays, ELISA calibration and endocrinology research." },
    { h: "Documentation", p: "Each lot includes a COA with purity, bioactivity where applicable, and recommended reconstitution buffer." },
  ],
  research: [
    { h: "Lab essentials", p: "Sterile diluents, reconstitution kits and calibrated buffers that make handling sensitive compounds safer and more reproducible." },
    { h: "Quality checked", p: "Consumables are sourced from ISO-certified manufacturers and lot-tracked for traceability." },
    { h: "Bulk supply", p: "Need larger quantities for a core facility? Request a quote for volume pricing." },
  ],
};

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ context, params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery());
    return { name: cat.name, intro: cat.intro };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.name} | Buy Research ${loaderData.name} | PeptideLabs` : "Category | PeptideLabs";
    const d = loaderData?.intro.slice(0, 155) ?? "Browse PeptideLabs research products.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = CATEGORIES.find((c) => c.slug === slug)!;
  const { data } = useSuspenseQuery(productsQuery());
  return (
    <>
      <PageHero title={cat.name} subtitle={cat.intro} image={cat.image} />
      <Catalog key={slug} products={data.filter((p) => p.category === slug)} lockCategory={slug} />
      <section className="bg-ice">
        <div className="container-x grid gap-6 py-12 md:grid-cols-3">
          {(EXTRA[slug] ?? []).map((e) => (
            <div key={e.h} className="rounded-lg bg-background p-6 shadow-card">
              <h2 className="text-lg font-extrabold text-navy">{e.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{e.p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
