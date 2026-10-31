import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogoMark } from "@/components/site/Logo";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login | PeptideLabs" }, { name: "robots", content: "noindex" }, { name: "description", content: "PeptideLabs admin sign in." }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    nav({ to: "/admin" });
  };
  return (
    <div className="grid min-h-screen place-items-center bg-navy-gradient px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-background p-8 shadow-card">
        <LogoMark className="mx-auto h-12 w-12 text-brand" />
        <h1 className="mt-3 text-center text-2xl font-extrabold text-navy">Admin sign in</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">PeptideLabs control panel</p>
        <label className="text-sm font-medium">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3 h-11 w-full rounded-md border border-input px-3" />
        <label className="text-sm font-medium">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 w-full rounded-md border border-input px-3" />
        {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
        <button disabled={busy} className="mt-5 h-11 w-full rounded-md bg-primary font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Signing in..." : "Sign in"}</button>
        <Link to="/" className="mt-4 block text-center text-sm text-brand">← Back to website</Link>
      </form>
    </div>
  );
}
