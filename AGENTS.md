<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public catalogue reads (products, posts, reviews) go through server functions in src/lib/catalog.functions.ts with a publishable client, so pages SSR for SEO; admin writes use the browser client under RLS (any signed-in user is admin by design).
- Uploaded media lives in the private "media" bucket and is referenced by long-lived signed URLs stored on the row, because the workspace blocks public buckets.
- All site forms (inquiry, cart checkout, contact, tracking, newsletter) post to FormSubmit via src/lib/formsubmit.ts; there is no online payment.
