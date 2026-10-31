import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { submitForm } from "@/lib/formsubmit";
import { money } from "@/lib/queries";

export type InquiryItem = { name: string; size: string | null; price: number; qty: number; image: string; slug: string; category?: string; purity?: string | null };

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
  country: z.string().trim().min(2, "Enter your country").max(60),
  organisation: z.string().trim().max(120).optional(),
  message: z.string().trim().max(1500).optional(),
  confirm: z.literal(true, { errorMap: () => ({ message: "Please confirm research use" }) }),
});

export function InquiryModal({
  open,
  onOpenChange,
  items,
  mode,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  items: InquiryItem[];
  mode: "quote" | "checkout";
  onSuccess?: () => void;
}) {
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const getQty = (i: InquiryItem) => qtys[i.slug] ?? i.qty;
  const total = items.reduce((s, i) => s + i.price * getQty(i), 0);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = schema.safeParse({ ...raw, confirm: raw["confirm"] === "on" });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const lines = items.map((i, n) => `${n + 1}. ${i.name} (${i.size ?? "-"}) x ${getQty(i)} @ ${money(i.price)} = ${money(i.price * getQty(i))}`).join("\n");
      const d = parsed.data;
      await submitForm(mode === "checkout" ? `Order inquiry from ${d.name} - PeptideLabs` : `Quote request: ${items[0]?.name} - PeptideLabs`, {
        "Inquiry type": mode === "checkout" ? "Cart checkout" : "Product quote",
        Name: d.name,
        Email: d.email,
        Phone: d.phone || "-",
        Country: d.country,
        Organisation: d.organisation || "-",
        Products: lines,
        "Estimated total": money(total),
        Message: d.message || "-",
        "Research-use confirmed": "Yes",
        _replyto: d.email,
      });
      setDone(true);
      onSuccess?.();
    } catch {
      toast.error("We couldn't send your inquiry. Please try again or email support@peptidelabs.com.");
    } finally {
      setBusy(false);
    }
  };

  const field = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring";
  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="mt-1 text-xs text-destructive">{errors[k]}</p> : null);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setTimeout(() => setDone(false), 300);
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
            <h2 className="mt-4 text-2xl font-extrabold text-navy">Inquiry sent</h2>
            <p className="mt-2 text-muted-foreground">Thank you. Our team will reply by email with a formal quote, availability for your region and documentation, usually within one business day.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-navy">{mode === "checkout" ? "Complete your order inquiry" : "Request a quote"}</DialogTitle>
              <DialogDescription>We'll confirm pricing, availability for your country and documentation before anything is dispatched. No payment is taken online.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 rounded-lg border border-border bg-muted p-3">
              {items.map((i) => (
                <div key={i.slug} className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3">
                  <img src={i.image} alt={i.name} className="h-14 w-14 rounded-md bg-background object-contain" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{[i.size, i.purity && `Purity ${i.purity}`].filter(Boolean).join(" • ")} • {money(i.price)} each</p>
                  </div>
                  <label className="flex items-center gap-1 text-xs text-muted-foreground">
                    Qty
                    <input type="number" min={1} max={999} value={getQty(i)} onChange={(e) => setQtys({ ...qtys, [i.slug]: Math.max(1, Number(e.target.value) || 1) })} className="h-8 w-16 rounded border border-input bg-background px-2 text-sm text-foreground" />
                  </label>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold text-navy">
                <span>Estimated total</span>
                <span>{money(total)}</span>
              </div>
            </div>
            <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
              <div><label className="text-sm font-medium">Full name *</label><input name="name" className={field} maxLength={100} /><Err k="name" /></div>
              <div><label className="text-sm font-medium">Email *</label><input name="email" type="email" className={field} maxLength={255} /><Err k="email" /></div>
              <div><label className="text-sm font-medium">Phone</label><input name="phone" className={field} maxLength={30} /></div>
              <div><label className="text-sm font-medium">Country *</label><input name="country" className={field} maxLength={60} /><Err k="country" /></div>
              <div className="sm:col-span-2"><label className="text-sm font-medium">Organisation / Institution</label><input name="organisation" className={field} maxLength={120} /></div>
              <div className="sm:col-span-2"><label className="text-sm font-medium">Message / shipping details</label><textarea name="message" rows={3} maxLength={1500} className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-ring" /></div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground sm:col-span-2">
                <input type="checkbox" name="confirm" className="mt-0.5" />
                I confirm these products are for laboratory research use only and that I am legally permitted to purchase them in my jurisdiction.
              </label>
              <div className="sm:col-span-2"><Err k="confirm" /></div>
              <button disabled={busy} className="h-11 rounded-md bg-primary font-semibold text-primary-foreground hover:bg-navy-deep disabled:opacity-60 sm:col-span-2">
                {busy ? "Sending..." : mode === "checkout" ? "Submit order inquiry" : "Send quote request"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
