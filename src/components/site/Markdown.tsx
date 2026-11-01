// Minimal, safe markdown renderer (headings, lists, paragraphs, inline bold). No HTML injection.
import { Fragment, type ReactNode } from "react";

function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="prose-lab">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (t.startsWith("### ")) return <h3 key={i}>{inline(t.slice(4))}</h3>;
        if (t.startsWith("## ")) {
          const [h, ...rest] = t.split("\n");
          return (
            <div key={i}>
              <h2>{inline((h ?? "").slice(3))}</h2>
              {rest.some((l) => /^[-*] /.test(l)) ? (
                <ul>{rest.filter((l) => l.trim()).map((l, j) => <li key={j}>{inline(l.replace(/^[-*] /, ""))}</li>)}</ul>
              ) : (
                rest.length > 0 && <p>{inline(rest.join(" "))}</p>
              )}
            </div>
          );
        }
        if (/^[-*] /.test(t))
          return (
            <ul key={i}>
              {t.split("\n").map((l, j) => (
                <li key={j}>{inline(l.replace(/^[-*] /, ""))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(t)}</p>;
      })}
    </div>
  );
}
