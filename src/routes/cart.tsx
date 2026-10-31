import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/queries";
import { InquiryModal } from "@/components/site/InquiryModal";
import { PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/cart")({
  head: () => seo("Your Cart | PeptideLabs", "Review the research products in your cart and submit an order inquiry to PeptideLabs."),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHero title="Shopping Cart" />
      <div className="container-x py-10">
        {!items.length ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/shop" className="mt-4 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground">Browse products</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="divide-y divide-border rounded-lg border border-border">
              {items.map((i) => (
                <div key={i.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 p-4">
                  <img src={i.image} alt={i.name} className="h-18 w-18 rounded-md bg-muted object-contain" />
                  <div className="min-w-0">
                    <Link to="/product/$slug" params={{ slug: i.slug }} className="block truncate font-semibold text-navy hover:text-brand">{i.name}</Link>
                    <p className="text-xs text-muted-foreground">{i.size} • {money(i.price)}</p>
                    <input type="number" min={1} value={i.qty} onChange={(e) => setQty(i.id, Number(e.target.value) || 1)} aria-label={`Quantity of ${i.name}`} className="mt-2 h-9 w-20 rounded-md border border-input px-2 text-sm" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-navy">{money(i.price * i.qty)}</p>
                    <button onClick={() => remove(i.id)} aria-label={`Remove ${i.name}`} className="mt-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            <aside className="h-fit rounded-lg bg-ice p-6">
              <h2 className="text-lg font-extrabold text-navy">Order summary</h2>
              <div className="mt-4 flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">{money(total)}</span></div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span>Quoted after review</span></div>
              <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold text-navy"><span>Estimated total</span><span>{money(total)}</span></div>
              <button onClick={() => setOpen(true)} className="mt-5 h-12 w-full rounded-md bg-primary font-semibold text-primary-foreground hover:bg-navy-deep">Proceed to checkout</button>
              <p className="mt-3 text-xs text-muted-foreground">Checkout sends an order inquiry. Our team confirms eligibility, shipping and payment options by email.</p>
            </aside>
          </div>
        )}
      </div>
      <InquiryModal open={open} onOpenChange={setOpen} mode="checkout" items={items.map((i) => ({ ...i }))} onSuccess={clear} />
    </>
  );
}
