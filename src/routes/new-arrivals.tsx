import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/queries";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/new-arrivals")({
  head: () => seo("New Arrivals | Latest Research Peptides & Compounds | PeptideLabs", "Discover the newest additions to the PeptideLabs catalogue: freshly released peptide batches, biotech products and lab supplies with full COA documentation."),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: () => {
    const { data } = useSuspenseQuery(productsQuery());
    const list = data.filter((p) => p.is_new);
    return (
      <>
        <PageHero title="New Arrivals" subtitle="The latest compounds and batches added to our catalogue. Every new release is tested by an independent laboratory before it goes live." />
        <div className="container-x grid grid-cols-2 gap-4 py-10 md:grid-cols-3 lg:grid-cols-5">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </>
    );
  },
});
