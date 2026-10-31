import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/wishlist")({
  head: () => seo("Wishlist | PeptideLabs", "Products you have saved for later at PeptideLabs."),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: () => {
    const { data } = useSuspenseQuery(productsQuery());
    const { wishlist } = useCart();
    const list = data.filter((p) => wishlist.includes(p.slug));
    return (
      <>
        <PageHero title="Wishlist" />
        <div className="container-x py-10">
          {list.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          ) : (
            <p className="text-center text-muted-foreground">No saved products yet. <Link to="/shop" className="text-brand underline">Browse the shop</Link>.</p>
          )}
        </div>
      </>
    );
  },
});
