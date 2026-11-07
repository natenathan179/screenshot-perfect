import { Link, useNavigate } from "@tanstack/react-router";
import { FlaskConical, Heart, Lock, Menu, Package, Search, ShoppingCart, Truck, User, X, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop All" },
  { to: "/category/$slug", params: { slug: "peptides" }, label: "Peptides" },
  { to: "/category/$slug", params: { slug: "steroids" }, label: "Steroids" },
  { to: "/category/$slug", params: { slug: "ancillaries" }, label: "Ancillaries" },
  { to: "/category/$slug", params: { slug: "biotech" }, label: "Biotechnology" },
  { to: "/category/$slug", params: { slug: "research" }, label: "Research Products" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/best-sellers", label: "Best Sellers" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const { count, wishlist } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/shop", search: { q: q.trim() || undefined } });
    setOpen(false);
  };
  return (
    <header className="sticky top-0 z-40 bg-background shadow-sm">
      <div className="bg-navy-deep text-xs text-ice">
        <div className="container-x flex h-9 items-center justify-between gap-4">
          <div className="hidden items-center gap-5 md:flex">
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" />Worldwide Shipping</span>
            <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" />Discreet Packaging</span>
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Secure Inquiries</span>
            <span className="flex items-center gap-1.5"><FlaskConical className="h-3.5 w-3.5" />Lab Tested Products</span>
          </div>
          <div className="flex w-full items-center justify-between gap-4 md:w-auto">
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />+1 (800) 555-0123</span>
            <a href="mailto:sales@peptidelabs.com" className="flex items-center gap-1.5 hover:text-primary-foreground"><Mail className="h-3.5 w-3.5" />sales@peptidelabs.com</a>
          </div>
        </div>
      </div>
      <div className="container-x grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Logo />
        <form onSubmit={go} className="hidden lg:flex lg:mx-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products, peptides, steroids..."
            aria-label="Search products"
            className="h-11 w-full rounded-l-md border border-input bg-muted px-4 text-sm outline-none focus:border-ring"
          />
          <button type="submit" aria-label="Search" className="grid h-11 w-12 shrink-0 place-items-center rounded-r-md bg-primary text-primary-foreground hover:bg-navy-deep">
            <Search className="h-4 w-4" />
          </button>
        </form>
        <div className="flex items-center gap-1 sm:gap-4">
          <Link to="/admin" className="hidden items-center gap-1.5 text-sm text-charcoal hover:text-brand sm:flex"><User className="h-5 w-5" />Account</Link>
          <Link to="/wishlist" className="relative flex items-center gap-1.5 p-2 text-sm text-charcoal hover:text-brand">
            <Heart className="h-5 w-5" /><span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && <span className="absolute -top-0.5 left-5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] text-accent-foreground">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="relative flex items-center gap-1.5 p-2 text-sm text-charcoal hover:text-brand">
            <ShoppingCart className="h-5 w-5" /><span className="hidden sm:inline">Cart</span>
            <span className="absolute -top-0.5 left-5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{count}</span>
          </Link>
          <button className="p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6 text-navy" /></button>
        </div>
      </div>
      <nav className="hidden bg-primary lg:block">
        <div className="container-x flex items-center">
          {NAV.map((n) => (
            <NavLink
              key={n.label}
              n={n}
              className="whitespace-nowrap px-2 py-3.5 text-[13px] font-semibold text-primary-foreground/90 transition-colors hover:bg-navy-deep hover:text-primary-foreground data-[status=active]:bg-brand data-[status=active]:text-primary-foreground xl:px-3 xl:text-sm 2xl:px-4"
            >
              {n.label}
            </NavLink>
          ))}
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-navy">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={go} className="mb-4 flex">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="h-10 w-full rounded-l-md border border-input px-3 text-sm" />
              <button className="grid h-10 w-10 place-items-center rounded-r-md bg-primary text-primary-foreground" aria-label="Search"><Search className="h-4 w-4" /></button>
            </form>
            {NAV.map((n) => (
              <NavLink key={n.label} n={n} onClick={() => setOpen(false)} className="border-b border-border py-3 font-medium text-navy">
                {n.label}
              </NavLink>
            ))}
            <Link to="/reviews" onClick={() => setOpen(false)} className="border-b border-border py-3 font-medium text-navy">Reviews</Link>
            <Link to="/admin" onClick={() => setOpen(false)} className="py-3 font-medium text-navy">Admin login</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ n, className, onClick, children }: { n: (typeof NAV)[number]; className: string; onClick?: () => void; children: React.ReactNode }) {
  if ("params" in n)
    return <Link to="/category/$slug" params={n.params} className={className} onClick={onClick}>{children}</Link>;
  return <Link to={n.to} activeOptions={{ exact: true }} className={className} onClick={onClick}>{children}</Link>;
}
