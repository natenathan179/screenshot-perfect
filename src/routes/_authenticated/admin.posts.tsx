import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { slugify, uploadImage } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/posts")({ component: AdminPosts });

type Post = { id?: string; title: string; slug: string; excerpt: string; content: string; cover_url: string; author: string; tags: string };
const empty: Post = { title: "", slug: "", excerpt: "", content: "", cover_url: "", author: "PeptideLabs Research Team", tags: "" };

function AdminPosts() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const [edit, setEdit] = useState<Post | null>(null);
  const [busy, setBusy] = useState(false);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin"] }); qc.invalidateQueries({ queryKey: ["posts"] }); qc.invalidateQueries({ queryKey: ["post"] }); };

  const save = async () => {
    if (!edit) return;
    if (!edit.title.trim()) { toast.error("Title is required"); return; }
    setBusy(true);
    const { id, tags, ...rest } = edit;
    const payload = { ...rest, slug: slugify(edit.slug || edit.title), tags: tags.split(",").map((t) => t.trim()).filter(Boolean), cover_url: edit.cover_url || null };
    const { error } = id ? await supabase.from("posts").update(payload).eq("id", id) : await supabase.from("posts").insert(payload);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Post saved");
    setEdit(null);
    refresh();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  };
  const inp = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-navy">Blog posts</h1>
        <button onClick={() => setEdit({ ...empty })} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />New post</button>
      </div>
      <div className="mt-4 grid gap-3">
        {data.map((p) => (
          <div key={p.id} className="grid grid-cols-[4rem_minmax(0,1fr)_auto] items-center gap-4 rounded-xl bg-background p-3 shadow-card">
            <img src={p.cover_url ?? "/images/lab.jpg"} alt="" className="h-12 w-16 rounded object-cover" />
            <div className="min-w-0"><p className="truncate font-semibold text-navy">{p.title}</p><p className="text-xs text-muted-foreground">{new Date(p.published_at).toLocaleDateString()}</p></div>
            <div>
              <button aria-label="Edit" onClick={() => setEdit({ id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", content: p.content ?? "", cover_url: p.cover_url ?? "", author: p.author, tags: p.tags.join(", ") })} className="p-2 text-navy"><Pencil className="h-4 w-4" /></button>
              <button aria-label="Delete" onClick={() => del(p.id)} className="p-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <Dialog open onOpenChange={(o) => !o && setEdit(null)}>
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader><DialogTitle>{edit.id ? "Edit post" : "New post"}</DialogTitle></DialogHeader>
            <div className="grid gap-3 text-sm">
              <label>Title *<input className={inp} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></label>
              <label>Slug<input className={inp} value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></label>
              <label>Author<input className={inp} value={edit.author} onChange={(e) => setEdit({ ...edit, author: e.target.value })} /></label>
              <label>Tags (comma separated)<input className={inp} value={edit.tags} onChange={(e) => setEdit({ ...edit, tags: e.target.value })} /></label>
              <label>Excerpt<textarea rows={2} className={`${inp} h-auto py-2`} value={edit.excerpt} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} /></label>
              <label>Content (## for headings)<textarea rows={12} className={`${inp} h-auto py-2`} value={edit.content} onChange={(e) => setEdit({ ...edit, content: e.target.value })} /></label>
              <div>
                <p className="mb-1">Cover image</p>
                <div className="flex items-center gap-3">
                  {edit.cover_url && <img src={edit.cover_url} alt="" className="h-20 w-32 rounded object-cover" />}
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-muted-foreground hover:border-brand">
                    <Upload className="h-4 w-4" />Upload image
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { const { url } = await uploadImage(file, "posts"); setEdit((x) => (x ? { ...x, cover_url: url } : x)); } catch (er) { toast.error((er as Error).message); } }} />
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEdit(null)} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
              <button disabled={busy} onClick={save} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{busy ? "Saving…" : "Save post"}</button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
