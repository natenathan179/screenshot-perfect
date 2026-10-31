import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/queries";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/best-sellers")({
  head: () => seo("Best Sellers | Most Popular Research Products | PeptideLabs", "Shop the most requested PeptideLabs products, including HCG, testosterone reference standards, TB-500 and tirzepatide, each with batch Certificates of Analysis."),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: () => {
    const { data } = useSuspenseQuery(productsQuery());
    const list = data.filter((p) => p.is_bestseller);
    return (
      <>
        <PageHero title="Best Sellers" subtitle="Our most requested research products, trusted by laboratories across the US, UK and Europe." />
        <div className="container-x grid grid-cols-2 gap-4 py-10 md:grid-cols-3 lg:grid-cols-5">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </>
    );
  },
});
