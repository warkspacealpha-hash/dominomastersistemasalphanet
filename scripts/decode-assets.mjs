// Decodes base64-encoded binary assets (images/fonts) that are stored as text
// in `assets-src/dp-b64/` (GitHub API pushes via this agent are text-only).
// Writes the decoded binaries into `public/dp/`, mirroring the captured site
// tree, so all original `url(...)` / `src` references keep working unchanged.
// Runs automatically via `predev` / `prebuild`. Safe to run repeatedly.
import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "assets-src", "dp-b64");
const outDir = join(root, "public", "dp");

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

let count = 0;
try {
  for (const f of walk(srcDir)) {
    if (!f.endsWith(".b64")) continue;
    const rel = relative(srcDir, f).split(sep).join("/");
    const dest = join(outDir, rel.slice(0, -4)); // strip ".b64"
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, Buffer.from(readFileSync(f, "utf8").trim(), "base64"));
    count++;
  }
  console.log(`[decode-assets] decoded ${count} binary asset(s) into public/dp/`);
} catch (err) {
  if (err.code === "ENOENT") {
    console.log("[decode-assets] assets-src/dp-b64 not found, skipping");
  } else {
    throw err;
  }
}
