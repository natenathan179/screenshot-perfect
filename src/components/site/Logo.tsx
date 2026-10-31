import { Link } from "@tanstack/react-router";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round">
        <path d="M24 4l8 4.6v9.2L24 22.4l-8-4.6V8.6z" />
        <path d="M14 21.6l8 4.6v9.2l-8 4.6-8-4.6v-9.2z" />
        <path d="M34 21.6l8 4.6v9.2l-8 4.6-8-4.6v-9.2z" />
      </g>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="PeptideLabs home">
      <LogoMark className={`h-10 w-10 shrink-0 ${light ? "text-ice" : "text-brand"}`} />
      <span className="min-w-0 leading-none">
        <span className={`block font-display text-2xl font-extrabold tracking-tight ${light ? "text-primary-foreground" : "text-navy"}`}>
          Peptide<span className={light ? "text-ice" : "text-brand"}>Labs</span>
        </span>
        <span className={`mt-1 block truncate text-xs ${light ? "text-ice/80" : "text-muted-foreground"}`}>Advancing Peptide Science.</span>
      </span>
    </Link>
  );
}
