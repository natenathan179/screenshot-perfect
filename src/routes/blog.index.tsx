import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/queries";
import { PageHero, seo } from "@/components/site/PageHero";

export const Route = createFileRoute("/blog/")({
  head: () => seo("Peptide Research Blog & Educational Articles | PeptideLabs", "Educational articles on peptides, GLP-1 agonists, steroid pharmacology, storage, reconstitution and reading Certificates of Analysis from the PeptideLabs research team."),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery()),
  component: Blog,
});

function Blog() {
  const { data } = useSuspenseQuery(postsQuery());
  const [first, ...rest] = data;
  return (
    <>
      <PageHero title="Research & Education" subtitle="Science-led articles that help researchers understand compounds, documentation, handling and regulation." image="/images/cat-biotech.jpg" crumb="Blog" />
      <div className="container-x py-12">
        {first && (
          <Link to="/blog/$slug" params={{ slug: first.slug }} className="grid overflow-hidden rounded-xl border border-border hover:shadow-card md:grid-cols-2">
            <img src={first.cover_url ?? "/images/lab.jpg"} alt={first.title} className="aspect-[16/10] h-full w-full object-cover" />
            <div className="p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-brand">Featured • {first.tags?.[0]}</p>
              <h2 className="mt-2 text-3xl font-extrabold text-navy">{first.title}</h2>
              <p className="mt-3 text-charcoal">{first.excerpt}</p>
              <p className="mt-4 text-sm text-muted-foreground">{first.author} • {new Date(first.published_at).toLocaleDateString()}</p>
            </div>
          </Link>
        )}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="overflow-hidden rounded-lg border border-border hover:shadow-card">
              <img src={p.cover_url ?? "/images/lab.jpg"} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase text-brand">{p.tags?.[0]}</p>
                <h2 className="mt-1 text-lg font-extrabold text-navy">{p.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-charcoal">{p.excerpt}</p>
                <p className="mt-3 text-xs text-muted-foreground">{new Date(p.published_at).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
