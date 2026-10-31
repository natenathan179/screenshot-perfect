import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, money } from "@/lib/queries";
import { slugify, uploadImage } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/products")({ component: AdminProducts });

type Img = { id?: string; url: string; storage_path?: string | null; position: number };
type Row = {
  id?: string; name: string; slug: string; category: string; subtitle: string; price: number; size: string; purity: string; form: string; storage: string;
  cas_number: string; short_description: string; description: string; specs: { label: string; value: string }[];
  is_featured: boolean; is_bestseller: boolean; is_new: boolean; in_stock: boolean; rating: number; review_count: number; product_images: Img[];
};
const empty: Row = { name: "", slug: "", category: "peptides", subtitle: "", price: 0, size: "", purity: "", form: "", storage: "", cas_number: "", short_description: "", description: "", specs: [], is_featured: false, is_bestseller: false, is_new: true, in_stock: true, rating: 5, review_count: 0, product_images: [] };

function AdminProducts() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, product_images(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const [edit, setEdit] = useState<Row | null>(null);
  const [q, setQ] = useState("");
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin"] }); qc.invalidateQueries({ queryKey: ["products"] }); qc.invalidateQueries({ queryKey: ["product"] }); };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    refresh();
  };

  const list = data.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-navy">Products</h1>
        <button onClick={() => setEdit({ ...empty })} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />Add product</button>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="mt-4 h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 text-sm" />
      <div className="mt-4 overflow-x-auto rounded-xl bg-background shadow-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-ice text-left text-navy"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Flags</th><th className="p-3" /></tr></thead>
          <tbody>
            {isLoading && <tr><td className="p-4 text-muted-foreground" colSpan={5}>Loading…</td></tr>}
            {list.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3"><div className="flex items-center gap-3"><img src={[...p.product_images].sort((a, b) => a.position - b.position)[0]?.url ?? "/images/products/vial-blue.jpg"} alt="" className="h-10 w-10 rounded bg-muted object-contain" /><span className="font-semibold text-navy">{p.name}</span></div></td>
                <td className="p-3 capitalize">{p.category}</td>
                <td className="p-3">{money(p.price)}</td>
                <td className="p-3 text-xs">{[p.is_featured && "Featured", p.is_bestseller && "Bestseller", p.is_new && "New", !p.in_stock && "Out of stock"].filter(Boolean).join(", ")}</td>
                <td className="p-3 text-right">
                  <button aria-label="Edit" onClick={() => setEdit({ ...empty, ...(p as unknown as Row), specs: (p.specs as Row["specs"]) ?? [], product_images: [...p.product_images].sort((a, b) => a.position - b.position) })} className="p-2 text-navy hover:text-brand"><Pencil className="h-4 w-4" /></button>
                  <button aria-label="Delete" onClick={() => del(p.id, p.name)} className="p-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {edit && <ProductForm row={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); refresh(); }} />}
    </div>
  );
}

function ProductForm({ row, onClose, onSaved }: { row: Row; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<Row>(row);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof Row>(k: K, v: Row[K]) => setF((x) => ({ ...x, [k]: v }));

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const added: Img[] = [];
      for (const file of Array.from(files)) {
        const { url, path } = await uploadImage(file, "products");
        added.push({ url, storage_path: path, position: 0 });
      }
      setF((x) => ({ ...x, product_images: [...x.product_images, ...added].map((im, i) => ({ ...im, position: i })) }));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!f.name.trim()) return toast.error("Name is required");
    if (!f.product_images.length) return toast.error("Upload at least one image");
    setBusy(true);
    const { id, product_images, ...rest } = f;
    const payload = { ...rest, slug: slugify(f.slug || f.name), price: Number(f.price) || 0, rating: Number(f.rating) || 5, review_count: Number(f.review_count) || 0, specs: f.specs.filter((s) => s.label.trim()), updated_at: new Date().toISOString() };
    const res = id ? await supabase.from("products").update(payload).eq("id", id).select("id").single() : await supabase.from("products").insert(payload).select("id").single();
    if (res.error) { setBusy(false); return toast.error(res.error.message); }
    const pid = res.data.id;
    await supabase.from("product_images").delete().eq("product_id", pid);
    const { error } = await supabase.from("product_images").insert(product_images.map((im, i) => ({ product_id: pid, url: im.url, storage_path: im.storage_path ?? null, position: i })));
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Product saved");
    onSaved();
  };

  const inp = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
  const L = ({ t, children, full }: { t: string; children: React.ReactNode; full?: boolean }) => (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}><span className="mb-1 block font-medium">{t}</span>{children}</label>
  );
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader><DialogTitle>{f.id ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <L t="Name *"><input className={inp} value={f.name} onChange={(e) => set("name", e.target.value)} /></L>
          <L t="URL slug (auto if empty)"><input className={inp} value={f.slug} onChange={(e) => set("slug", e.target.value)} /></L>
          <L t="Category"><select className={inp} value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></L>
          <L t="Subtitle"><input className={inp} value={f.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></L>
          <L t="Price (USD)"><input type="number" step="0.01" className={inp} value={f.price} onChange={(e) => set("price", Number(e.target.value))} /></L>
          <L t="Size"><input className={inp} value={f.size ?? ""} onChange={(e) => set("size", e.target.value)} /></L>
          <L t="Purity"><input className={inp} value={f.purity ?? ""} onChange={(e) => set("purity", e.target.value)} /></L>
          <L t="Form"><input className={inp} value={f.form ?? ""} onChange={(e) => set("form", e.target.value)} /></L>
          <L t="Storage"><input className={inp} value={f.storage ?? ""} onChange={(e) => set("storage", e.target.value)} /></L>
          <L t="CAS number"><input className={inp} value={f.cas_number ?? ""} onChange={(e) => set("cas_number", e.target.value)} /></L>
          <L t="Rating (0-5)"><input type="number" step="0.1" min={0} max={5} className={inp} value={f.rating} onChange={(e) => set("rating", Number(e.target.value))} /></L>
          <L t="Review count"><input type="number" className={inp} value={f.review_count} onChange={(e) => set("review_count", Number(e.target.value))} /></L>
          <L t="Short description" full><textarea rows={2} className={`${inp} h-auto py-2`} value={f.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} /></L>
          <L t="Full description (use ## for headings, blank line between paragraphs)" full><textarea rows={8} className={`${inp} h-auto py-2`} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} /></L>
          <div className="flex flex-wrap gap-4 text-sm sm:col-span-2">
            {(["is_featured", "is_bestseller", "is_new", "in_stock"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} />{{ is_featured: "Featured", is_bestseller: "Bestseller", is_new: "New arrival", in_stock: "In stock" }[k]}</label>
            ))}
          </div>
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium">Specifications</p>
            {f.specs.map((s, i) => (
              <div key={i} className="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2">
                <input className={inp} placeholder="Label" value={s.label} onChange={(e) => set("specs", f.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                <input className={inp} placeholder="Value" value={s.value} onChange={(e) => set("specs", f.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                <button aria-label="Remove spec" onClick={() => set("specs", f.specs.filter((_, j) => j !== i))} className="px-2 text-destructive"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={() => set("specs", [...f.specs, { label: "", value: "" }])} className="text-sm font-semibold text-brand">+ Add specification</button>
          </div>
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium">Images * (first image is the main image)</p>
            <div className="flex flex-wrap gap-3">
              {f.product_images.map((im, i) => (
                <div key={im.url} className="relative">
                  <img src={im.url} alt="" className={`h-24 w-24 rounded-md border-2 bg-muted object-contain ${i === 0 ? "border-brand" : "border-border"}`} />
                  <button aria-label="Remove image" onClick={() => set("product_images", f.product_images.filter((_, j) => j !== i))} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"><X className="h-3 w-3" /></button>
                  {i > 0 && <button onClick={() => { const a = [...f.product_images]; const [m] = a.splice(i, 1); a.unshift(m); set("product_images", a); }} className="mt-1 block w-24 text-center text-[11px] text-brand">Make main</button>}
                </div>
              ))}
              <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-md border-2 border-dashed border-border text-xs text-muted-foreground hover:border-brand">
                <span className="flex flex-col items-center gap-1"><Upload className="h-5 w-5" />{uploading ? "Uploading…" : "Upload"}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
              </label>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button disabled={busy || uploading} onClick={save} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save product"}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
