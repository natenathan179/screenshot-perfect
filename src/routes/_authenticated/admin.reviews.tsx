import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadImage } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/reviews")({ component: AdminReviews });

type R = { id?: string; name: string; location: string; avatar_url: string; rating: number; title: string; body: string; product_name: string };
const empty: R = { name: "", location: "", avatar_url: "", rating: 5, title: "", body: "", product_name: "" };

function AdminReviews() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const [edit, setEdit] = useState<R | null>(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin"] }); qc.invalidateQueries({ queryKey: ["reviews"] }); };
  const save = async () => {
    if (!edit) return;
    if (!edit.name.trim() || !edit.body.trim()) return toast.error("Name and review text are required");
    const { id, ...rest } = edit;
    const payload = { ...rest, rating: Math.min(5, Math.max(1, Number(rest.rating) || 5)), avatar_url: rest.avatar_url || null };
    const { error } = id ? await supabase.from("reviews").update(payload).eq("id", id) : await supabase.from("reviews").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Review saved");
    setEdit(null);
    refresh();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };
  const inp = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-navy">Reviews ({data.length})</h1>
        <button onClick={() => setEdit({ ...empty })} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />Add review</button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {data.map((r) => (
          <div key={r.id} className="grid grid-cols-[3rem_minmax(0,1fr)_auto] gap-3 rounded-xl bg-background p-4 shadow-card">
            <img src={r.avatar_url ?? ""} alt="" className="h-12 w-12 rounded-full bg-muted object-cover" />
            <div className="min-w-0"><p className="font-semibold text-navy">{r.name} <span className="text-star">{"★".repeat(r.rating)}</span></p><p className="line-clamp-2 text-xs text-muted-foreground">{r.body}</p></div>
            <div>
              <button aria-label="Edit" onClick={() => setEdit({ id: r.id, name: r.name, location: r.location ?? "", avatar_url: r.avatar_url ?? "", rating: r.rating, title: r.title ?? "", body: r.body, product_name: r.product_name ?? "" })} className="p-1.5 text-navy"><Pencil className="h-4 w-4" /></button>
              <button aria-label="Delete" onClick={() => del(r.id)} className="p-1.5 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <Dialog open onOpenChange={(o) => !o && setEdit(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{edit.id ? "Edit review" : "New review"}</DialogTitle></DialogHeader>
            <div className="grid gap-3 text-sm">
              <label>Name *<input className={inp} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
              <label>Location<input className={inp} value={edit.location} onChange={(e) => setEdit({ ...edit, location: e.target.value })} /></label>
              <label>Rating (1-5)<input type="number" min={1} max={5} className={inp} value={edit.rating} onChange={(e) => setEdit({ ...edit, rating: Number(e.target.value) })} /></label>
              <label>Title<input className={inp} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></label>
              <label>Product<input className={inp} value={edit.product_name} onChange={(e) => setEdit({ ...edit, product_name: e.target.value })} /></label>
              <label>Review *<textarea rows={4} className={`${inp} h-auto py-2`} value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} /></label>
              <div className="flex items-center gap-3">
                {edit.avatar_url && <img src={edit.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />}
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-muted-foreground"><Upload className="h-4 w-4" />Upload photo
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const { url } = await uploadImage(f, "avatars"); setEdit((x) => (x ? { ...x, avatar_url: url } : x)); } catch (er) { toast.error((er as Error).message); } }} />
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEdit(null)} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Save</button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
