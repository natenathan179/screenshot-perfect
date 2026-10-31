import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { submitForm } from "@/lib/formsubmit";

type F = { name: string; label: string; type?: string; required?: boolean; textarea?: boolean; full?: boolean };

export function SimpleForm({ subject, fields, button }: { subject: string; fields: F[]; button: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    for (const f of fields) {
      const v = (data[f.name] ?? "").trim();
      if (f.required && !v) errs[f.name] = `${f.label} is required`;
      else if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) errs[f.name] = "Enter a valid email";
      else if (v.length > (f.textarea ? 3000 : 200)) errs[f.name] = "Too long";
    }
    setErr(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const payload: Record<string, string> = {};
      fields.forEach((f) => (payload[f.label] = (data[f.name] ?? "").trim() || "-"));
      if (data["email"]) payload["_replyto"] = data["email"];
      await submitForm(subject, payload);
      setDone(true);
    } catch {
      toast.error("Could not send. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  if (done)
    return (
      <div className="rounded-lg bg-ice p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <p className="mt-3 text-lg font-bold text-navy">Message received</p>
        <p className="text-sm text-muted-foreground">Our team will reply by email within one business day.</p>
      </div>
    );
  const cls = "w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring";
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.textarea || f.full ? "sm:col-span-2" : ""}>
          <label htmlFor={f.name} className="mb-1 block text-sm font-medium">{f.label}{f.required && " *"}</label>
          {f.textarea ? <textarea id={f.name} name={f.name} rows={5} className={`${cls} py-2`} /> : <input id={f.name} name={f.name} type={f.type ?? "text"} className={`${cls} h-11`} />}
          {err[f.name] && <p className="mt-1 text-xs text-destructive">{err[f.name]}</p>}
        </div>
      ))}
      <button disabled={busy} className="h-12 rounded-md bg-primary font-semibold text-primary-foreground hover:bg-navy-deep disabled:opacity-60 sm:col-span-2">{busy ? "Sending..." : button}</button>
    </form>
  );
}
