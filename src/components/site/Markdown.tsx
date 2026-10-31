// Minimal, safe markdown renderer (headings, lists, paragraphs). No HTML injection.
export function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="prose-lab">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (t.startsWith("### ")) return <h3 key={i}>{t.slice(4)}</h3>;
        if (t.startsWith("## ")) {
          const [h, ...rest] = t.split("\n");
          return (
            <div key={i}>
              <h2>{h.slice(3)}</h2>
              {rest.length > 0 && <p>{rest.join(" ")}</p>}
            </div>
          );
        }
        if (/^[-*] /.test(t))
          return (
            <ul key={i}>
              {t.split("\n").map((l, j) => (
                <li key={j}>{l.replace(/^[-*] /, "")}</li>
              ))}
            </ul>
          );
        return <p key={i}>{t}</p>;
      })}
    </div>
  );
}
