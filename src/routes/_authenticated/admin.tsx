import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileText, LayoutDashboard, LogOut, Package, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin | PeptideLabs" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { user } = Route.useRouteContext();
  const out = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/admin/login", replace: true });
  };
  const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/posts", label: "Blog posts", icon: FileText },
    { to: "/admin/reviews", label: "Reviews", icon: Star },
  ] as const;
  return (
    <div className="min-h-screen bg-muted md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen">
        <div className="p-5"><Logo light /></div>
        <nav className="flex gap-1 overflow-x-auto px-3 md:flex-col">
          {items.map((i) => (
            <Link key={i.to} to={i.to} activeOptions={{ exact: "exact" in i }} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-sidebar-accent data-[status=active]:bg-sidebar-primary">
              <i.icon className="h-4 w-4" />{i.label}
            </Link>
          ))}
          <a href="/" target="_blank" className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-sidebar-accent"><ExternalLink className="h-4 w-4" />View site</a>
          <button onClick={out} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm hover:bg-sidebar-accent"><LogOut className="h-4 w-4" />Sign out</button>
        </nav>
        <p className="hidden truncate px-6 py-4 text-xs text-sidebar-foreground/60 md:block">{user.email}</p>
      </aside>
      <div className="p-4 md:p-8"><Outlet /></div>
    </div>
  );
}
