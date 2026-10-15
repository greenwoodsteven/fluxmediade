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
  // Extra 480 px variants for portfolio images (used in srcset on phones).
  const variants = [{ name: rel, width: null }, ...(rel.startsWith("work/") ? [{ name: `${rel}-480`, width: 480 }] : [])];
  for (const v of variants)
    for (const [ext, opts] of [["avif", { quality: 50 }], ["webp", { quality: 75 }]]) {
      const dest = path.join(out, `${v.name}.${ext}`);
      try {
        if ((await stat(dest)).mtimeMs > (await stat(file)).mtimeMs) continue;
      } catch {}
      await mkdir(path.dirname(dest), { recursive: true });
      let img = sharp(file);
      if (v.width) img = img.resize({ width: v.width });
      await img[ext](opts).toFile(dest);
      n++;
    }
}
console.log(`images: ${n} file(s) generated`);
