import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQuery, postsQuery } from "@/lib/queries";
import { Markdown } from "@/components/site/Markdown";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!p) throw notFound();
    await context.queryClient.ensureQueryData(postsQuery());
    return { title: p.title, excerpt: p.excerpt ?? "", date: p.published_at, author: p.author };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article unavailable | PeptideLabs" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.title} | PeptideLabs Blog`;
    return {
      meta: [{ title: t }, { name: "description", content: loaderData.excerpt }, { property: "og:title", content: t }, { property: "og:description", content: loaderData.excerpt }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: loaderData.title, datePublished: loaderData.date, author: { "@type": "Organization", name: loaderData.author } }) }],
    };
  },
  notFoundComponent: () => <div className="container-x py-20 text-center"><h1 className="text-3xl font-extrabold text-navy">Article not found</h1><Link to="/blog" className="text-brand underline">Back to blog</Link></div>,
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(postQuery(slug));
  const { data: all } = useSuspenseQuery(postsQuery());
  if (!p) return null;
  return (
    <>
      <PageHero title={p.title} crumb="Blog" subtitle={<span className="text-sm">{p.author} • {new Date(p.published_at).toLocaleDateString("en-US", { dateStyle: "long" })}</span>} />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="max-w-3xl">
          {p.cover_url && <img src={p.cover_url} alt={p.title} className="mb-8 aspect-[16/8] w-full rounded-xl object-cover" />}
          <Markdown text={p.content ?? ""} />
        </article>
        <aside className="space-y-4">
          <div className="rounded-lg bg-ice p-5">
            <h2 className="font-extrabold text-navy">More articles</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {all.filter((x) => x.slug !== slug).slice(0, 5).map((x) => (
                <li key={x.id}><Link to="/blog/$slug" params={{ slug: x.slug }} className="font-medium text-brand hover:underline">{x.title}</Link></li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-navy-gradient p-5 text-primary-foreground">
            <h2 className="font-extrabold">Questions about a compound?</h2>
            <p className="mt-2 text-sm text-ice/80">Our scientific support team can help with specifications and documentation.</p>
            <Link to="/contact" className="mt-3 inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-accent-foreground">Contact us</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
