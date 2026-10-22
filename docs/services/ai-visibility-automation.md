# AI visibility report: Node.js automation solution

Working document. Not deployed (`docs/` is never shipped). Companion to [`ai-visibility.md`](ai-visibility.md), which
defines the report, the methods and the step table (section 7: which steps are automatable and what stays manual).
This file describes how to automate those steps.

Status: **proposal, nothing built yet.** The code blocks are sketches to show the shape; they have not been run.

## One command, one review gate

Idea: a small command-line pipeline in Node.js runs all **Yes** steps and the collecting/drafting part of every
**Partly** step, writes everything into one folder, and stops at a **review file** that lists exactly what the person
has to do or decide. After the review, a second command builds the PDF. Nothing is sent to the customer automatically.

Why Node: Lighthouse, axe, Playwright and Promptfoo are Node-native, so one runtime covers everything. The pipeline
is a local or CI tool in its own folder (for example `tools/visibility/` or a separate repo). It is **not** part of
the Next.js site: the site is a static export on shared hosting without a Node runtime, and Chromium plus customer
data do not belong in that build.

Requirements: Node 20 or newer, Chromium via Playwright (`npx playwright install chromium`), optional API keys in
environment variables (`PSI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `PERPLEXITY_API_KEY`).

Libraries:

| Job | Package |
|-----|---------|
| HTTP, headers, redirects | built-in `fetch` (undici), `node:dns` where needed |
| HTML parsing, headings, JSON-LD extraction | `cheerio` |
| robots.txt rules per user agent | `robots-parser` |
| Rendered DOM, screenshots, PDF | `playwright` (`page.screenshot`, `page.pdf`) |
| Lighthouse | `lighthouse` and `chrome-launcher` (or the PageSpeed Insights API with `fetch`) |
| Accessibility | `@axe-core/playwright` |
| AI answers | `ai` (Vercel AI SDK) with provider packages, or `openai` / `@anthropic-ai/sdk`; Promptfoo for repeat runs and assertions |
| Structured-data types | `schema-dts` (types only); validation stays manual (Rich Results Test) |
| Config and CLI | `commander` or `node:util.parseArgs`; `zod` to validate `evidence.json` |
| Templates to HTML | plain template literals or `marked` for Markdown |

Layout:

```
visibility/
  package.json            # "type": "module"; scripts: run, build
  run.mjs                 # node run.mjs --url https://example.com/ --terms "Zahnarzt Konstanz" --lang de
  build.mjs               # node build.mjs work/example.com-2026-10-22
  steps/
    fetch.mjs             # 4, 5, 6, 7, 12  headers, robots.txt, raw vs rendered HTML, markup, images
    lighthouse.mjs        # 8, 9            Lighthouse via Node API or PageSpeed Insights
    schema-check.mjs      # 10              JSON-LD extraction, errors, compare with visible text
    axe-check.mjs         # 11              axe results through Playwright
    ai-answers.mjs        # 13, 14, 15, 16  API runs, counts, citations
    screenshots.mjs       # 20              Playwright screenshots
    score.mjs             # 18              scoring table, ranked draft findings
    draft.mjs             # 19              fills the report template, optional LLM draft
    review.mjs            # generates REVIEW.md from the step table
  templates/report.de.html, report.en.html
  promptfooconfig.yaml    # optional: repeat runs and assertions (`ai-visibility.md`, section 5.4)
  work/<domain>-<date>/   # git-ignored: customer data
    evidence.json         # all measured data, tool versions, dates
    answers.json          # API answers plus a manual section to fill in
    findings.draft.json   # ranked findings, each with an evidence reference
    report.draft.md       # editable draft
    REVIEW.md             # generated tick-box list of the manual tasks
    shots/                # screenshots
```

Skeleton of `run.mjs` (each step is isolated, so one failing step does not stop the run):

```js
import { parseArgs } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import * as fetchStep from "./steps/fetch.mjs";
import * as lighthouseStep from "./steps/lighthouse.mjs";
import * as schemaStep from "./steps/schema-check.mjs";
import * as axeStep from "./steps/axe-check.mjs";
import * as aiStep from "./steps/ai-answers.mjs";
import * as shotStep from "./steps/screenshots.mjs";
import { score } from "./steps/score.mjs";
import { draft } from "./steps/draft.mjs";
import { writeReview } from "./steps/review.mjs";

const { values: a } = parseArgs({ options: { url: { type: "string" }, terms: { type: "string" }, lang: { type: "string", default: "de" } } });
const host = new URL(a.url).hostname;
const dir = `work/${host}-${new Date().toISOString().slice(0, 10)}`;
await mkdir(`${dir}/shots`, { recursive: true });

const ctx = { url: a.url, terms: a.terms, lang: a.lang, dir, evidence: {} };
for (const [name, step] of Object.entries({ fetchStep, lighthouseStep, schemaStep, axeStep, shotStep, aiStep })) {
  try { ctx.evidence[name] = await step.run(ctx); }
  catch (e) { ctx.evidence[name] = { error: String(e) }; }          // record and continue
}
ctx.findings = score(ctx.evidence);                                    // step 18 (draft)
await writeFile(`${dir}/evidence.json`, JSON.stringify(ctx.evidence, null, 2));
await writeFile(`${dir}/findings.draft.json`, JSON.stringify(ctx.findings, null, 2));
await draft(ctx);                                                      // step 19 (draft)
await writeReview(ctx);                                                // REVIEW.md with the manual tasks
console.log(`Done. Review: ${dir}/REVIEW.md`);
```

Lighthouse from Node (median of three runs; store the version):

```js
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

export async function run({ url }) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
  const runs = [];
  for (let i = 0; i < 3; i++) {
    const r = await lighthouse(url, { port: chrome.port, output: "json", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] });
    runs.push(r.lhr);
  }
  await chrome.kill();
  const med = (f) => runs.map(f).sort((x, y) => x - y)[1];
  return {
    version: runs[0].lighthouseVersion,
    scores: Object.fromEntries(Object.keys(runs[0].categories).map((k) => [k, Math.round(med((r) => r.categories[k].score) * 100)])),
    lcpMs: med((r) => r.audits["largest-contentful-paint"].numericValue),
    cls: med((r) => r.audits["cumulative-layout-shift"].numericValue),
    tbtMs: med((r) => r.audits["total-blocking-time"].numericValue),   // lab stand-in for INP
    // Lighthouse recommendations with estimated savings (from the first run), largest first.
    // The free report uses only the top one; the paid analysis uses the list after review.
    opportunities: Object.values(runs[0].audits)
      .filter((x) => x.details?.type === "opportunity" && x.score !== null && x.score < 0.9)
      .map((x) => ({ id: x.id, title: x.title, savingMs: x.details.overallSavingsMs ?? 0, savingBytes: x.details.overallSavingsBytes ?? 0 }))
      .sort((p, q) => q.savingMs - p.savingMs)
      .slice(0, 10),
  };
}
```

axe through Playwright:

```js
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

export async function run({ url }) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  await browser.close();
  return violations.map((v) => ({ id: v.id, impact: v.impact, count: v.nodes.length, help: v.help }));
}
```

Raw vs rendered text (step 6) with `fetch` and Playwright:

```js
const raw = await (await fetch(url)).text();                        // what a simple crawler sees
const rawText = cheerio.load(raw)("body").text().replace(/\s+/g, " ").trim();
// after page.goto(): const renderedText = await page.locator("body").innerText();
const jsDependent = rawText.length < renderedText.length * 0.5;     // flag: main text missing without JavaScript
```

AI answers: use Promptfoo (`ai-visibility.md`, section 5.4) for repeated runs and assertions, or call the providers directly with the AI SDK
(`generateText({ model, prompt })`) in `ai-answers.mjs` and reuse the counting logic of `ai-visibility.md` section 5.3. The Python
LiteLLM script in `ai-visibility.md` section 5 stays as a reference; in Node the SDK takes its place (or point the `openai` client at a LiteLLM
proxy URL if one budget and key store is wanted).

Flow:

1. `node run.mjs --url ... --terms ...` runs steps 2, 4-16 and 18-20 with a time limit and writes `work/<domain>-<date>/`.
2. The person opens **`REVIEW.md`**, generated from the step table in `ai-visibility.md` section 7. For each **Partly** and **No** step it lists the
   manual task and the data to look at, for example:
   - [ ] Step 3: approve or change the 3 questions in `answers.json`; name 2 to 3 competitors
   - [ ] Step 10: compare name/address/phone with the Google Business Profile (link generated)
   - [ ] Step 11: keyboard walk-through; mark false positives in `evidence.json`
   - [ ] Step 13: paste answers from ChatGPT, Gemini and Google AI into `answers.json` (manual section, template included)
   - [ ] Step 16: read the 3 longest answers fully; mark wrong claims
   - [ ] Step 17: write "possible cause" for each of the top three findings
   - [ ] Step 18: confirm the top three; for each Lighthouse opportunity used, check it applies to the real page (free report: only the largest one, no how-to)
   - [ ] Step 19: edit `report.draft.md`; remove anything unsupported
   - [ ] Step 20: crop screenshots, remove third-party personal data
   - [ ] Step 22: run the quality checklist (`ai-visibility.md`, section 3)
3. `node build.mjs work/<domain>-<date>` refuses to run while unticked items remain in `REVIEW.md`, converts the
   Markdown to HTML with the template, writes the PDF with Playwright `page.pdf()` (step 21) and writes the delivery
   entry (step 24).
4. The person sends the mail (step 23). `build.mjs` never sends mail.

Design rules:
- **Evidence first:** every sentence in the draft points to a value in `evidence.json`; the LLM draft (if used) only
  rephrases evidence and may not add facts. The person still edits it.
- **Reproducible:** save raw HTML, headers and API responses with tool versions and dates, so the re-test (step 25)
  and a customer's question later can be answered.
- **Privacy:** keep `work/` out of git (customer data); only public business data goes into LLM prompts or Google's
  API; delete the folder per the retention in `docs/privacy-actions.md`.
- **Cost and limits:** cap the LLM calls per run, set provider budgets, keep keys in environment variables.
- **Crawling manners:** one page, no crawling beyond the agreed URL (the free check covers the home page only),
  honest user agent, timeouts.
- **Optional UI later:** a local-only Next.js or Vite app in the same folder could replace `REVIEW.md` with a form,
  once the Markdown review feels clumsy. Never deploy it to the public site.
- **Build order (smallest useful first):** `fetch` + `lighthouse` + the `REVIEW.md` generator, then `ai-answers`,
  then `schema-check` and `axe-check`, then `score`/`draft`, last the PDF template.

Expected effect: the one-hour effort of the free check drops mostly to the review (steps 13 apps, 16, 17, 19, 22),
about 25 to 35 minutes; measure it on the first five real requests before promising anything.
