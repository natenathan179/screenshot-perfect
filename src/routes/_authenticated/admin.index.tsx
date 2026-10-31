import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Dashboard });

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const c = async (t: "products" | "posts" | "reviews") => (await supabase.from(t).select("id", { count: "exact", head: true })).count ?? 0;
      return { products: await c("products"), posts: await c("posts"), reviews: await c("reviews") };
    },
  });
  const cards = [
    { k: "products", label: "Products", to: "/admin/products" as const },
    { k: "posts", label: "Blog posts", to: "/admin/posts" as const },
    { k: "reviews", label: "Reviews", to: "/admin/reviews" as const },
  ];
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-navy">Dashboard</h1>
      <p className="text-muted-foreground">Manage your catalogue, articles and reviews.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.k} to={c.to} className="rounded-xl bg-background p-6 shadow-card hover:ring-2 hover:ring-ring">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-display text-4xl font-black text-navy">{data ? data[c.k as keyof typeof data] : "…"}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-xl bg-background p-6 text-sm text-charcoal shadow-card">
        <p className="font-bold text-navy">Inquiries</p>
        <p className="mt-1">Quote requests, checkout inquiries and contact messages are delivered to your inbox via FormSubmit.</p>
      </div>
    </div>
  );
}
