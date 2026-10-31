import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { categoryName, money, productImage, type Product } from "@/lib/queries";
import { InquiryModal } from "./InquiryModal";

export function Stars({ rating, className = "h-3.5 w-3.5" }: { rating: number; className?: string }) {
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${className} ${i <= Math.round(rating) ? "fill-star text-star" : "text-border"}`} />
      ))}
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add, wishlist, toggleWish } = useCart();
  const [open, setOpen] = useState(false);
  const img = productImage(p);
  const badge = p.is_bestseller ? "Bestseller" : p.is_featured ? "Featured" : p.is_new ? "New" : null;
  const quoteOnly = p.category === "steroids" || !p.in_stock;
  const wished = wishlist.includes(p.slug);
  return (
    <div className="group flex flex-col rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-card">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="relative block overflow-hidden rounded-md bg-muted">
        {badge && <span className={`absolute left-2 top-2 z-10 rounded px-2 py-0.5 text-[11px] font-semibold ${badge === "Bestseller" ? "bg-primary text-primary-foreground" : "bg-brand text-accent-foreground"}`}>{badge}</span>}
        <img src={img} alt={[...(p.product_images ?? [])].sort((a, b) => a.position - b.position)[0]?.alt_text ?? p.name} loading="lazy" width={400} height={400} className="aspect-square w-full object-contain transition-transform duration-300 group-hover:scale-105" />
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <Link to="/product/$slug" params={{ slug: p.slug }} className="line-clamp-1 font-semibold text-navy hover:text-brand">{p.name}</Link>
        <p className="text-xs text-muted-foreground">{categoryName(p.category)} | {p.size}</p>
        <p className="mt-2 font-display text-lg font-bold text-navy">{money(p.price)}</p>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Stars rating={p.rating} /> ({p.review_count})</div>
        <div className="mt-3 flex items-center gap-2">
          {quoteOnly ? (
            <button onClick={() => setOpen(true)} className="h-9 flex-1 rounded-md bg-brand text-sm font-semibold text-accent-foreground hover:opacity-90">Request Quote</button>
          ) : (
            <button
              onClick={() => {
                add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), size: p.size, image: img });
                toast.success(`${p.name} added to cart`);
              }}
              className="h-9 flex-1 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-navy-deep"
            >
              Add to Cart
            </button>
          )}
          <button onClick={() => toggleWish(p.slug)} aria-label="Toggle wishlist" className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border hover:border-brand">
            <Heart className={`h-4 w-4 ${wished ? "fill-brand text-brand" : "text-navy"}`} />
          </button>
        </div>
      </div>
      <InquiryModal open={open} onOpenChange={setOpen} mode="quote" items={[{ name: p.name, size: p.size, price: Number(p.price), qty: 1, image: img, slug: p.slug, purity: p.purity }]} />
    </div>
  );
}
