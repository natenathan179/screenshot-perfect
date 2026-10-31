import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { submitForm } from "@/lib/formsubmit";

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const sub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Enter a valid email address"); return; }
    setBusy(true);
    try {
      await submitForm("Newsletter signup - PeptideLabs", { email });
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch {
      toast.error("Could not subscribe right now. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const col = "space-y-2 text-sm text-ice/80";
  const h = "mb-3 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground";
  return (
    <footer className="bg-navy-gradient text-primary-foreground">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.6fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-ice/75">
            Third-party tested peptides, reference compounds and research supplies, documented batch by batch.
          </p>
        </div>
        <div>
          <h3 className={h}>Quick Links</h3>
          <ul className={col}>
            <li><Link to="/" className="hover:text-primary-foreground">Home</Link></li>
            <li><Link to="/shop" className="hover:text-primary-foreground">Shop All</Link></li>
            <li><Link to="/blog" className="hover:text-primary-foreground">Research Blog</Link></li>
            <li><Link to="/reviews" className="hover:text-primary-foreground">Reviews</Link></li>
            <li><Link to="/about" className="hover:text-primary-foreground">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={h}>Support</h3>
          <ul className={col}>
            <li><Link to="/faq" className="hover:text-primary-foreground">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-primary-foreground">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-primary-foreground">Returns Policy</Link></li>
            <li><Link to="/track-order" className="hover:text-primary-foreground">Track Order</Link></li>
            <li><Link to="/contact" className="hover:text-primary-foreground">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={h}>Legal</h3>
          <ul className={col}>
            <li><Link to="/privacy" className="hover:text-primary-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary-foreground">Terms & Conditions</Link></li>
            <li><Link to="/regulatory" className="hover:text-primary-foreground">Regulatory Disclosures</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={h}>Join Our Newsletter</h3>
          <p className="mb-3 text-sm text-ice/75">Get research updates, new products and special offers.</p>
          <form onSubmit={sub} className="flex">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email address" aria-label="Email address" className="h-11 min-w-0 flex-1 rounded-l-md bg-background px-3 text-sm text-foreground outline-none" />
            <button disabled={busy} className="h-11 shrink-0 rounded-r-md bg-brand px-4 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-x space-y-2 py-5 text-xs text-ice/60">
          <p>
            All products are sold strictly for laboratory research use only. Not for human or veterinary use. Prescription-only and controlled substances are supplied only to appropriately licensed buyers where legally permitted.
          </p>
          <div className="flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} PeptideLabs. All rights reserved.</span>
            <span>Safe • Secure • Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
