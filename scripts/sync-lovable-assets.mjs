// Downloads every Lovable-hosted asset (src/assets/**/*.asset.json) into public/
// at the same /__l5e/assets-v1/... path, so hosts other than Lovable (e.g. Cloudflare)
// can serve the product images referenced in the database.
// Usage: node scripts/sync-lovable-assets.mjs
import { readdir, readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src", "assets");
const OUT = join(ROOT, "public");

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".asset.json")) yield p;
  }
}

let ok = 0, skipped = 0, failed = 0;
for await (const file of walk(SRC)) {
  const meta = JSON.parse(await readFile(file, "utf8"));
  const dest = join(OUT, meta.url);
  try {
    if ((await stat(dest)).size === meta.size) { skipped++; continue; }
  } catch {}
  const src = `https://${meta.project_id}.lovableproject.com${meta.url}`;
  const res = await fetch(src);
  if (!res.ok) { console.error(`FAIL ${res.status} ${meta.url}`); failed++; continue; }
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  ok++;
}
console.log(`downloaded ${ok}, already present ${skipped}, failed ${failed}`);
if (failed) process.exit(1);
