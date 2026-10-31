import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, type Product } from "@/lib/queries";
import { ProductCard } from "./ProductCard";

export function Catalog({ products, initialQ = "", lockCategory }: { products: Product[]; initialQ?: string; lockCategory?: string }) {
  const [q, setQ] = useState(initialQ);
  const [cats, setCats] = useState<string[]>(lockCategory ? [lockCategory] : []);
  const [sort, setSort] = useState("newest");
  const [max, setMax] = useState(200);
  const [stock, setStock] = useState(false);

  const list = useMemo(() => {
    const s = q.toLowerCase();
    const r = products.filter(
      (p) =>
        (!cats.length || cats.includes(p.category)) &&
        Number(p.price) <= max &&
        (!stock || p.in_stock) &&
        (!s || [p.name, p.subtitle, p.short_description, p.cas_number].some((x) => x?.toLowerCase().includes(s))),
    );
    return r.sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : sort === "name" ? a.name.localeCompare(b.name) : +new Date(b.created_at) - +new Date(a.created_at),
    );
  }, [products, q, cats, sort, max, stock]);

  return (
    <div className="container-x grid gap-8 py-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase text-navy">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, CAS, keyword" className="h-10 w-full rounded-md border border-input pl-9 pr-3 text-sm" />
          </div>
        </div>
        {!lockCategory && (
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-navy">Category</p>
            {CATEGORIES.map((c) => (
              <label key={c.slug} className="flex items-center gap-2 py-1 text-sm">
                <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => setCats((x) => (x.includes(c.slug) ? x.filter((y) => y !== c.slug) : [...x, c.slug]))} />
                {c.name} <span className="text-muted-foreground">({products.filter((p) => p.category === c.slug).length})</span>
              </label>
            ))}
          </div>
        )}
        <div>
          <p className="mb-2 text-sm font-bold uppercase text-navy">Max price: ${max}</p>
          <input type="range" min={10} max={200} step={5} value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full accent-brand" />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} />In stock only</label>
      </aside>
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{list.length} products</p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
        {list.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">No products match your filters.</p>
        )}
      </div>
    </div>
  );
}
