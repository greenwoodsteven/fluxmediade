// Writes src/content/site.generated.json from config/site.local.json (git-ignored, real business data).
// Falls back to config/site.example.json (placeholders) so a fresh clone still builds.
// `--strict` fails while any value still contains a [PLACEHOLDER] (used by deploy/deploy.sh).
// Override the source with SITE_CONFIG=/path/to/file.json.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const strict = process.argv.includes("--strict");
const local = process.env.SITE_CONFIG ?? "config/site.local.json";
const example = "config/site.example.json";

let src = local, raw;
try { raw = await readFile(local, "utf8"); }
catch { src = example; raw = await readFile(example, "utf8"); console.warn(`site-config: ${local} not found, using ${example} (placeholders)`); }

const data = JSON.parse(raw);
const problems = [];
const str = (v, key, required = true) => {
  if (typeof v !== "string" || (required && v.trim() === "")) problems.push(`${key} must be a non-empty string`);
};
for (const k of ["name", "legalName", "email", "phone", "region"]) str(data[k], k);
str(data.vatId, "vatId", false);
for (const k of ["street", "zip", "city", "country"]) str(data.address?.[k], `address.${k}`);
if (!Array.isArray(data.partners) || data.partners.length === 0 || data.partners.some((p) => typeof p !== "string" || !p.trim()))
  problems.push("partners must be a non-empty list of names");
if (typeof data.email === "string" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) problems.push("email is not a valid address");
if (problems.length) { console.error(`site-config: ${src} is invalid:\n- ${problems.join("\n- ")}`); process.exit(1); }

const open = [];
const walk = (v, key) => {
  if (typeof v === "string") { if (/\[[^\]]+\]/.test(v)) open.push(`${key} = ${v}`); }
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${key}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, key ? `${key}.${k}` : k);
};
walk(data, "");
if (open.length) {
  const msg = `site-config: ${open.length} placeholder(s) still open in ${src}:\n- ${open.join("\n- ")}`;
  if (strict) { console.error(msg); process.exit(1); }
  console.warn(msg);
}

const out = path.resolve("src/content/site.generated.json");
await writeFile(out, JSON.stringify(data, null, 2) + "\n");
console.log(`site-config: ${src} -> src/content/site.generated.json`);
