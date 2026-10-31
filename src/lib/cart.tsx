import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { id: string; slug: string; name: string; price: number; size: string | null; image: string; qty: number };

type Ctx = {
  items: CartItem[];
  add: (i: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
  wishlist: string[];
  toggleWish: (slug: string) => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("pl_cart") || "[]"));
      setWishlist(JSON.parse(localStorage.getItem("pl_wish") || "[]"));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("pl_cart", JSON.stringify(items));
  }, [items, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("pl_wish", JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const value: Ctx = {
    items,
    add: (i, qty = 1) =>
      setItems((prev) => {
        const ex = prev.find((p) => p.id === i.id);
        if (ex) return prev.map((p) => (p.id === i.id ? { ...p, qty: p.qty + qty } : p));
        return [...prev, { ...i, qty }];
      }),
    setQty: (id, qty) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))),
    remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
    clear: () => setItems([]),
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.price, 0),
    wishlist,
    toggleWish: (slug) => setWishlist((w) => (w.includes(slug) ? w.filter((x) => x !== slug) : [...w, slug])),
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
