import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHero({ title, subtitle, crumb, image }: { title: string; subtitle?: ReactNode; crumb?: string; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-ice">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
      <div className="relative container-x py-12 md:py-16">
        <nav className="mb-3 flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-navy">{crumb ?? title}</span>
        </nav>
        <h1 className="text-3xl font-extrabold uppercase text-navy md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-3xl text-base text-charcoal md:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}

export function InfoSections({ sections }: { sections: { h: string; p: (string | string[])[] }[] }) {
  return (
    <div className="container-x grid gap-10 py-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-48 rounded-lg border border-border bg-muted p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">On this page</p>
          <ul className="space-y-1.5 text-sm">
            {sections.map((s, i) => (
              <li key={i}><a href={`#s${i}`} className="text-navy hover:text-brand">{s.h}</a></li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="prose-lab max-w-3xl">
        {sections.map((s, i) => (
          <section key={i} id={`s${i}`} className="scroll-mt-48">
            <h2>{s.h}</h2>
            {s.p.map((x, j) =>
              Array.isArray(x) ? (
                <ul key={j}>{x.map((li, k) => <li key={k}>{li}</li>)}</ul>
              ) : (
                <p key={j}>{x}</p>
              ),
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export function seo(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
