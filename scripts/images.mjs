// Pre-generates AVIF + WebP next to the originals (static export has no image optimizer).
// Output goes to public/images/generated/ (git-ignored, rebuilt by `npm run build`).
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public/images");
const out = path.join(root, "generated");

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (p === out) continue;
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png)$/i.test(e.name)) yield p;
  }
}

let n = 0;
for await (const file of walk(root)) {
  const rel = path.relative(root, file).replace(/\.[^.]+$/, "");
  for (const [ext, opts] of [["avif", { quality: 55 }], ["webp", { quality: 78 }]]) {
    const dest = path.join(out, `${rel}.${ext}`);
    try {
      if ((await stat(dest)).mtimeMs > (await stat(file)).mtimeMs) continue;
    } catch {}
    await mkdir(path.dirname(dest), { recursive: true });
    await sharp(file)[ext](opts).toFile(dest);
    n++;
  }
}
console.log(`images: ${n} file(s) generated`);
