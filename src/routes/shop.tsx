import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { productsQuery } from "@/lib/queries";
import { Catalog } from "@/components/site/Catalog";
import { PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => z.object({ q: z.string().max(100).optional() }).parse(s),
  head: () => seo("Shop All Research Products | PeptideLabs", "Browse the full PeptideLabs catalogue of research peptides, steroid reference compounds, biotech products and lab supplies. Filter by category, price and availability."),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Shop,
});

function Shop() {
  const { data } = useSuspenseQuery(productsQuery());
  const { q } = Route.useSearch();
  return (
    <>
      <PageHero title="Shop All Products" subtitle="Every PeptideLabs product is third-party tested and shipped with a batch Certificate of Analysis. Use the filters to find exactly what your research requires." image="/images/cat-research.jpg" />
      <Catalog key={q} products={data} initialQ={q ?? ""} />
    </>
  );
}
