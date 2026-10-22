# AI visibility (GEO / AEO) & SEO analysis: report layout, tools and method

Working document. Not deployed (`docs/` is never shipped). Public wording lives in `src/content/{de,en}.json`
(`services.geo`, `analysis`); scope and prices in [`../services-deliverables.md`](../services-deliverables.md).

Why SEO is in the title: AI answers draw on search indexes (Google, Bing) and on crawled pages, so indexing,
technical SEO, on-page basics and speed are preconditions for being cited. The same measurements serve both. Link
building, backlinks and ads are not part of the service.

Two scopes use the same method:

| Scope | Pages | Output | Time |
|-------|-------|--------|------|
| Free start-page check | home page only | 1-2 page PDF, three findings | about 1 hour, delivered within 48 hours |
| Multi-page analysis (paid) | agreed pages | full written report plus fixes and re-test | per quote |

This file describes the **start-page report** (what the customer receives) and then the **tools and method**
behind it. The paid analysis repeats each block for more pages and adds implementation and a re-test.

Rule: the free report **names** problems and says why they matter. It does not give step-by-step fixes.
No guaranteed rankings or citations, anywhere in the report.

---

## 1. The report the customer receives

PDF, A4, German or English to match the request, delivered by e-mail. Plain language first, technical detail in the
last section. Placeholders in `[brackets]`.

### Page 1: summary

1. **Header**: Fluxmedia, "Kostenlose SEO- & KI-Analyse", customer name, analysed URL, date, search terms from the form.
2. **Overall picture in three sentences**: where the site stands today and the single most useful next step.
3. **Scorecard** (traffic light per area, one line each):

   | Area | Status | One-line reason |
   |------|--------|-----------------|
   | Technical basics (title, description, headings, indexing) | green / amber / red | [e.g. "no meta description"] |
   | Speed and mobile (Core Web Vitals) | | [e.g. "LCP 3.4 s on mobile"] |
   | Structured data | | [e.g. "none found"] |
   | Access for search and AI crawlers | | [e.g. "GPTBot blocked"] |
   | AI visibility (spot check) | | [e.g. "named in 1 of 15 answers"] |
   | Accessibility (conspicuous barriers) | | [e.g. "7 images without alt text"] |

4. **The three biggest findings** (ranked), each with: what we saw, why it matters for search or AI answers, how
   serious (high / medium / low) and rough effort (small / medium / large). Evidence as a short screenshot or snippet.

### Page 2: details

5. **Technical basics of the home page**
   - Title and description: text, length, whether they match the search terms.
   - Headings: one H1? Logical order? Do sub-headings answer real questions?
   - Indexing: robots meta, canonical, status code, redirect chain (http, www, trailing slash), sitemap listed.
   - Mobile: viewport, tap targets, text size.
   - Core Web Vitals: LCP and CLS from the Lighthouse lab run, with Total Blocking Time (TBT) as the lab stand-in
     for INP; real INP, LCP and CLS from field data (PageSpeed Insights / CrUX) if the site has enough traffic.
     State for every number whether it is lab or field.
   - Lighthouse recommendations ("opportunities" and "diagnostics", each with an estimated saving in seconds or
     KiB): **free report** shows only the single largest one as a finding (for example "images are too large,
     about 0.6 s"); **paid analysis** lists all of them, sorted by saving, reviewed against the real site (the advice
     is generic and some items do not apply).
6. **Content without JavaScript**: is the main text visible in the raw HTML? (Many AI crawlers do not run scripts.)
7. **Structured data**: types found (Organization, LocalBusiness, Service, FAQ, BreadcrumbList), errors and warnings,
   or "none". Whether name, address, phone, opening hours and the logo agree with the visible page and the
   Google Business Profile.
8. **Crawler access**: robots.txt rules for Googlebot, Bingbot and the AI crawlers (GPTBot, OAI-SearchBot,
   ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended); presence of `llms.txt` (informational only, no proven
   effect). Whether blocking is deliberate is the customer's decision; we only report the state.
9. **AI visibility spot check**: see section 2.3. Table of questions against the assistants, with date, and the
   result in words: named, linked, described correctly, wrong, or absent. Which competitors or directories were
   named instead.
10. **Accessibility, conspicuous items only**: alternative text, contrast, keyboard focus, form labels, language
    attribute. This is not a conformity statement (that needs the paid accessibility audit).
11. **What we did not check**: other pages, backlinks, ads, Google Business Profile in depth, legal texts.

### Last page: next steps

12. Short list of what we would do first, the free-check-to-paid-analysis offer ("from 450 EUR, fixed price after we
    have seen your site"), and the honest limit: *"We cannot promise rankings or citations. The report shows where
    your site stands today."*
13. **Footer**: date of measurement, tool versions, note that results of AI assistants vary from run to run and
    change over time; contact details.

---

## 2. Tools and methods

### 2.1 Preparation

- **Intake**: URL, search terms (1-3, usually "service + place"), industry, target region, competitors if known.
  Data comes from the form. It stays out of the report except the URL and terms.
- **Baseline fetch**: `curl -sIL https://example.com/` for status, redirect chain and response headers (HSTS,
  cache, `Link`, `X-Robots-Tag`); `curl -s` for the raw HTML. Also http vs https and with vs without `www`.
- **Clean browser profile** (no extensions, not logged in, desktop and mobile emulation) so the page is seen as a
  first-time visitor sees it.

### 2.2 Technical and content checks

| Check | Tool / method |
|-------|---------------|
| Speed, SEO basics, best practices | **Lighthouse** (Chrome DevTools or CLI), mobile profile, three runs, median |
| Field data (real users) | **PageSpeed Insights** / Chrome UX Report, if the origin has enough traffic |
| Accessibility, conspicuous items | **axe DevTools / axe-core CLI**, WAVE as second opinion, quick keyboard walk-through (Tab, focus visible) |
| Raw HTML vs rendered page | `curl` vs DevTools "Elements"; Chrome with JavaScript disabled; "View source" |
| Headings, links, images | DevTools, **HeadingsMap** or a small script over the DOM; link count and anchor text |
| Indexing and canonicals | meta robots, canonical tag, `site:domain` check, sitemap.xml, **Google Search Console** and **Bing Webmaster Tools** if the customer grants read access (optional; never ask for passwords) |
| robots.txt and AI crawlers | read `/robots.txt` and test rules per user agent; optional log check on the customer's side for GPTBot, ClaudeBot and others |
| Structured data | **Schema Markup Validator** (validator.schema.org), **Google Rich Results Test**, JSON-LD read by hand for consistency with the visible page |
| Redirects, status codes, mixed content | `curl`, browser console, **Screaming Frog SEO Spider** (free up to 500 URLs; used for the multi-page scope) |
| Images | DevTools Network panel: formats (AVIF/WebP), sizes, `loading`, `width`/`height` |

Each measurement is stored with date, tool and version, so the re-test after the work is comparable.

### 2.3 AI visibility test (the part that is not automatic)

Goal: find out whether and how assistants name and describe the customer's business for questions a real
customer would ask. This is a **sample, not a ranking**.

1. **Question set**: 3 questions for the free check (15 or more for the paid analysis), written from the customer's
   point of view, mixed types:
   - Local intent: "Welcher Zahnarzt in Konstanz bietet Sprechstunde am Samstag an?"
   - Comparison: "Worauf achte ich bei einem Steuerberater am Bodensee?"
   - Brand: "Was ist [Firmenname] für ein Unternehmen?" (does the assistant know the firm, and is it right?)
2. **Assistants**: ChatGPT (with web search on), Claude (with web search), Perplexity, Gemini and Google AI
   Overviews / AI Mode. Logged out or in a fresh account, German interface, location set to the customer's region
   where the tool allows it.
3. **Record per answer**: date, tool and mode, exact wording, whether the business is named, whether the site is
   linked or cited (and which page), whether the facts are correct (address, services, hours), which competitors,
   directories or review sites were named, and the sources the assistant shows.
4. **Repeat** each question at least twice (answers vary); record the pattern, not a single answer.
5. **Interpret carefully**: the result depends on the assistant, the day and the wording. Findings are phrased as
   "named in 2 of 6 answers on [date]". Missing citations are linked back to causes we can see on the site
   (no crawlable text, no structured data, crawler blocked, no clear answer text, thin or inconsistent business
   data), never presented as proof of cause.
6. **Privacy**: only the customer's public business data goes into the assistants. No personal data of the
   customer's clients, no passwords or private documents.

### 2.4 Assessment

Every finding is rated with the same three questions:

1. **Impact**: could it stop pages being found, read or quoted?
2. **Certainty**: measured (tool output) or judged (our reading)?
3. **Effort**: small (hours), medium (days), large (project).

The top three by impact, then effort, go on page 1. Everything else stays in the detail section (or, for the free
check, is left for the paid analysis).

### 2.5 What makes content citable (reference points used when judging pages)

- The main text is in the HTML, not only created by scripts.
- One H1; sub-headings that are real questions; the short answer first, details after.
- Facts that are easy to lift: services, prices or price ranges, area served, hours, address, who is responsible.
- Same business data everywhere: site, structured data, Google Business Profile, directory entries.
- Structured data that matches the visible content (Organization/LocalBusiness, Service, FAQPage, BreadcrumbList).
- Fast, stable, accessible pages: the same traits that help people also help crawlers.
- Crawlers allowed, as far as the customer wants (robots.txt), sitemap present.

### 2.6 Limits to state in every report

- No guaranteed placement in AI answers or search results; assistants change without notice.
- The spot check is small and time-stamped; field data may be missing for low-traffic sites.
- Free check: home page only. Tool scores are indicators, not goals in themselves.
- This is not legal advice and not a conformity statement for accessibility (BFSG / WCAG).

---

## 3. Workflow and time (free check, about 1 hour)

| Step | Minutes | Output |
|------|---------|--------|
| Intake, fetch, headers, robots.txt | 8 | notes, saved HTML |
| Lighthouse (3 runs), PSI, axe | 12 | scores, screenshots |
| Structured data, headings, no-JS view | 10 | findings list |
| AI spot check: 3 questions, 5 assistants, repeat | 20 | answer log |
| Rating, top three, PDF | 10 | report |

Checklist before sending: URL and date correct, three findings ranked and supported by evidence, no fix
instructions in the free version, limits section present, no personal data of third parties in screenshots.

## 4. Technical markup checklist

Tick per page. "Measured by" says how the check is done (section 2.2). Items marked *optional* have no proven effect
on AI answers; list them as hygiene, not as promises.

**Crawling and indexing**
- [ ] Status 200, one canonical URL (http to https, with or without `www`, trailing slash: one 301 hop at most)
- [ ] `<link rel="canonical">` is absolute, self-referencing and matches the sitemap URL
- [ ] No `noindex` in meta robots or `X-Robots-Tag` on pages that should be found
- [ ] `robots.txt` reachable, no blanket `Disallow: /`, rules for AI crawlers set on purpose (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended)
- [ ] `sitemap.xml` present, listed in `robots.txt`, only indexable URLs, `lastmod` correct
- [ ] Main text is in the raw HTML (check with `curl` and with JavaScript off)
- [ ] `hreflang` pairs are reciprocal where there are two languages, plus `x-default`
- [ ] *Optional:* `/llms.txt` with a short description and links to key pages

**Page basics**
- [ ] `<html lang>` set and correct
- [ ] Unique `<title>` (about 50 to 60 characters) with the service and place
- [ ] Unique meta description (about 120 to 160 characters)
- [ ] Exactly one `<h1>`; headings in order; sub-headings phrased as real questions where it fits
- [ ] The short answer comes first, details after
- [ ] Descriptive link text; no "click here"
- [ ] Open Graph and Twitter tags (`og:title`, `og:description`, `og:image`, `og:url`) for previews

**Structured data (JSON-LD, one `<script type="application/ld+json">` per node or one `@graph`)**
- [ ] `Organization` or a `LocalBusiness` subtype (for example `ProfessionalService`) with `@id`, `name`, `url`, `logo`, `image`, `email` or `telephone`, `address` (`PostalAddress`), `areaServed`
- [ ] Opening hours (`openingHoursSpecification`) and `geo` for local businesses with a shop or practice
- [ ] `sameAs` with real profile URLs (Google Business Profile, LinkedIn, directories); only profiles that exist
- [ ] `WebSite` node with `publisher` pointing to the organisation `@id`
- [ ] `Service` (with `provider`, `areaServed`, `Offer` and price where public) on service pages
- [ ] `BreadcrumbList` on sub-pages
- [ ] `FAQPage` only for questions that are visible on the same page, with the same text
- [ ] `Person` for named experts or authors, where the page is about them
- [ ] Every value in the markup is also visible on the page; name, address and phone agree with Google Business Profile and directories
- [ ] No errors in the Schema Markup Validator and the Rich Results Test; warnings reviewed

**Performance and accessibility basics that crawlers and people both feel**
- [ ] LCP 2.5 s or less, CLS 0.1 or less, INP 200 ms or less (mobile lab data, field data if available)
- [ ] Images with `alt` (decorative ones `alt=""`), `width` and `height`, modern formats, lazy loading below the fold
- [ ] Contrast, visible focus, labelled form fields, landmarks (`header`, `nav`, `main`, `footer`)
- [ ] HTTPS with HSTS; no mixed content; cache headers on static assets

Measured by: curl, Lighthouse, axe, Schema Markup Validator, Rich Results Test, Search Console.

---

## 5. Minimal open-source visibility tracker (LiteLLM and Promptfoo)

Purpose: repeat the question set from section 2.3 on a schedule and keep the answers, so changes show up as numbers
instead of impressions. **Complement to the manual spot check, not a replacement.**

Two small open-source tools, each with one job:

| Tool | Job |
|------|-----|
| **LiteLLM** (Python) | One call syntax for many providers; used to collect raw answers and run the simple "is the brand named" check |
| **Promptfoo** (Node) | Declarative test runs: same prompts against several models, repeated runs, assertions, a comparison table and a history |

### 5.1 Honest limits (put in every report that uses it)

- An API call is **not** the same as the consumer product. The ChatGPT, Claude or Gemini apps add web search,
  memory, location and system prompts. A bare API call to a model answers from training data and shows nothing about
  today's web. To measure citations from live sources, use a model or mode that searches the web (for example
  Perplexity Sonar, or the provider's search tool/option where it exists), and say which one was used.
- Answers vary from run to run: repeat each prompt (at least 3 times) and report a rate ("named in 2 of 5 runs"), never a single result.
- Model names change often; check each provider's current model list before a run and store the exact model ID in the log.
- Cost is small but not zero (a few cents per run with 10 prompts and 4 models). Set a budget limit at the provider.
- API keys live in environment variables or a git-ignored `.env`, never in the repository (see `.gitignore`).
- Only the customer's public business data goes into prompts.

### 5.2 Setup

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install litellm
export OPENAI_API_KEY=...  ANTHROPIC_API_KEY=...  PERPLEXITYAI_API_KEY=...   # only the providers you use
npm install -g promptfoo        # or: npx promptfoo@latest ...
```

Suggested folder, outside the website build (for example `tools/visibility/` or a separate repo per customer):

```
visibility/
  prompts.yaml        # question set (customer-specific)
  brand.yaml          # names, domains, competitors to look for
  track.py            # LiteLLM script: raw answers + simple check
  promptfooconfig.yaml
  results/            # dated JSON output (git-ignored if it holds customer data)
```

### 5.3 LiteLLM script

Starts from the basic example: ask each model, look for the brand name or domain. Extended with repeats, a question
list, competitor counts and a dated result file. Model IDs are placeholders; replace them with current ones.

```python
import json, re, datetime, pathlib
import litellm

BRAND = ["Fluxmedia", "fluxmedia.de"]                # names and domains that count as "visible"
COMPETITORS = ["Beispiel Agentur", "example-agency.de"]
PROMPTS = [
    "Welche Webentwickler am Bodensee bieten SEO- und KI-Sichtbarkeitsanalysen an?",
    "Worauf achte ich bei einem Website-Relaunch zum Festpreis?",
    "Was ist Fluxmedia für ein Unternehmen?",
]
MODELS = ["gpt-4o", "claude-sonnet-4-5", "perplexity/sonar"]   # placeholders: check current IDs
RUNS = 3

def mentions(text, needles):
    return [n for n in needles if re.search(re.escape(n), text, re.I)]

results = []
for prompt in PROMPTS:
    for model in MODELS:
        for run in range(RUNS):
            row = {"prompt": prompt, "model": model, "run": run,
                   "date": datetime.date.today().isoformat()}
            try:
                r = litellm.completion(model=model, messages=[{"role": "user", "content": prompt}], temperature=0.7)
                text = r.choices[0].message.content or ""
                row |= {
                    "visible": bool(mentions(text, BRAND)),
                    "brand_hits": mentions(text, BRAND),
                    "competitor_hits": mentions(text, COMPETITORS),
                    "snippets": [l.strip() for l in text.splitlines() if mentions(l, BRAND)][:3],
                    # Perplexity returns its sources; other providers may not
                    "citations": getattr(r, "citations", None),
                    "answer": text,
                }
            except Exception as e:                     # one failing model must not stop the run
                row["error"] = str(e)
            results.append(row)

out = pathlib.Path("results") / f"{datetime.date.today()}.json"
out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps(results, ensure_ascii=False, indent=2))

# Summary: share of runs in which the brand was named, per model
for model in MODELS:
    rows = [r for r in results if r["model"] == model and "error" not in r]
    hits = sum(r["visible"] for r in rows)
    print(f"{model}: named in {hits} of {len(rows)} runs")
```

Notes:
- `temperature` above 0 keeps the natural variation, which is what a visitor would see.
- A string match is a rough test: "Flux" in unrelated text, or the brand mentioned negatively, counts too. The
  manual review of a sample stays part of the report.
- Store the full `answer`, so a changed result can be traced and checked later.

### 5.4 Promptfoo config

Promptfoo adds repeats, assertions and a comparison view without extra code. `promptfooconfig.yaml`:

```yaml
description: Visibility of Fluxmedia, Bodensee web agency
prompts:
  - "{{question}}"
providers:                       # exact IDs: see the provider docs; these are placeholders
  - openai:gpt-4o
  - anthropic:messages:claude-sonnet-4-5
  - perplexity:sonar
tests:
  - vars: { question: "Welche Webentwickler am Bodensee bieten SEO- und KI-Sichtbarkeitsanalysen an?" }
    assert:
      - type: icontains-any
        value: ["Fluxmedia", "fluxmedia.de"]
        metric: brand_named
  - vars: { question: "Was ist Fluxmedia für ein Unternehmen?" }
    assert:
      - type: icontains
        value: "Überlingen"           # fact the answer should get right
        metric: fact_location
      - type: not-icontains
        value: "Hamburg"              # a fact it should not invent
        metric: no_wrong_location
```

Run and read:

```bash
promptfoo eval -c promptfooconfig.yaml --repeat 3 -o results/$(date +%F).json
promptfoo view            # local web UI with the comparison table
```

Why both: LiteLLM gives raw data and full control (custom checks, citations, your own file format); Promptfoo gives
a table the customer can understand and checks that fail loudly. Promptfoo can also call models through a LiteLLM
proxy (OpenAI-compatible endpoint) if one set of keys and budgets is wanted.

### 5.5 What goes into the report

| Metric | Meaning |
|--------|---------|
| Mention rate | share of runs in which brand or domain appears, per model and per question |
| Citation rate | share of runs that link or cite the customer's domain (only where the provider returns sources) |
| Fact accuracy | address, services, location named correctly (Promptfoo assertions or manual check) |
| Competitor share | who is named when the customer is not |
| Trend | the same set re-run after the changes, with dates (the "vorher-nachher" comparison in the paid package) |

Run monthly for ongoing customers, or before and after the implementation for one-off projects. Keep the question
set fixed between runs, otherwise numbers are not comparable.

---

## 6. API-driven Lighthouse audit

Two ways, same result format. Use the **PageSpeed Insights API** for quick checks and field data, the **Lighthouse
CLI** when full control or a login-free staging URL is needed.

### 6.1 PageSpeed Insights API (Google runs Lighthouse for you)

Endpoint: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`. Works for public URLs only. An API key is
free and avoids tight rate limits (create it in Google Cloud, restrict it to the PageSpeed Insights API, keep it in
`PSI_API_KEY`, never in the repository). The tested URL is sent to Google, which is acceptable for a customer's
public site; do not use it for non-public pages.

```python
import os, json, urllib.parse, urllib.request

def psi(url, strategy="mobile"):
    q = [("url", url), ("strategy", strategy), ("locale", "de")] + \
        [("category", c) for c in ("performance", "accessibility", "best-practices", "seo")]
    if os.environ.get("PSI_API_KEY"):
        q.append(("key", os.environ["PSI_API_KEY"]))
    api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + urllib.parse.urlencode(q)
    with urllib.request.urlopen(api, timeout=120) as r:
        d = json.load(r)
    lh = d["lighthouseResult"]
    a = lh["audits"]
    field = d.get("loadingExperience", {}).get("metrics", {})   # real-user data, absent for low-traffic sites
    return {
        "url": url, "strategy": strategy, "fetched": lh["fetchTime"], "lighthouse": lh["lighthouseVersion"],
        "scores": {k: round(v["score"] * 100) for k, v in lh["categories"].items()},
        "lab": {k: a[k]["numericValue"] for k in
                ("largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "first-contentful-paint")},
        "field_lcp_ms": field.get("LARGEST_CONTENTFUL_PAINT_MS", {}).get("percentile"),
        "failed_audits": [k for k, v in a.items() if v.get("score") == 0][:15],
        # Lighthouse recommendations: audits with an estimated saving, largest first
        "opportunities": sorted(
            [{"id": k, "title": v["title"], "saving_ms": v["details"].get("overallSavingsMs", 0),
              "saving_bytes": v["details"].get("overallSavingsBytes", 0)}
             for k, v in a.items()
             if v.get("details", {}).get("type") == "opportunity" and v.get("score") is not None and v["score"] < 0.9],
            key=lambda o: o["saving_ms"], reverse=True)[:10],
    }

for strategy in ("mobile", "desktop"):
    print(json.dumps(psi("https://www.example.com/", strategy), ensure_ascii=False, indent=2))
```

Practice: run three times and take the median (lab values scatter); run both `mobile` and `desktop`; store the JSON
with date and Lighthouse version.

### 6.2 Lighthouse CLI (local, repeatable, works for staging)

```bash
npm install -g lighthouse             # needs Chrome or Chromium
lighthouse https://www.example.com/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html --output-path=./results/lh-$(date +%F) \
  --chrome-flags="--headless=new" --quiet

# read scores from the JSON
jq '{perf: .categories.performance.score, a11y: .categories.accessibility.score,
     seo: .categories.seo.score, lcp: .audits["largest-contentful-paint"].numericValue}' results/lh-*.report.json
```

Defaults emulate a mid-range phone on slow 4G; add `--preset=desktop` for desktop. For CI, **Lighthouse CI**
(`@lhci/cli`) can fail a build when a budget is missed, for example performance below 0.9 or LCP above 2500 ms.

### 6.3 Reading the result

- Scores are indicators. The measured values (LCP, CLS, TBT, INP in the field) and the list of failed audits matter more.
- Lighthouse does not measure INP in the lab. It reports TBT as a proxy; real INP only appears in field data.
- The opportunities are Lighthouse's own recommendations with estimated savings. They are good starting points for
  findings, but generic: check each against the real page before it goes into a report. Estimated savings overlap
  and do not add up.
- SEO category passes do not mean AI visibility: it checks basics only (title, description, crawlable links, robots, `lang`, canonical).
- Lab data on one machine differs from field data; say which one a number is from.
- Accessibility category is a subset of what axe finds and is no conformity statement; run axe separately (section 2.2).

---

## 7. Report production checklist: what can be automated

Steps to produce one start-page report, in order. **Yes** = a script can do it end to end, **Partly** = a script
collects or drafts and a person decides or checks, **No** = needs human judgement or access. In the Notes column,
**Manual:** says what the person has to do or decide.

| # | Step | Tool / method | Automatable | Notes |
|---|------|---------------|-------------|-------|
| 1 | Receive request, confirm e-mail, store URL and search terms | form, `api/analysis.php`, `confirm.php` | **Yes** | Already built (proof of work, double opt-in, studio mail) |
| 2 | Check that the request is usable (real site, reachable, not a duplicate) | `curl`, domain hash check | **Partly** | Script: reachability, redirect target, duplicate check. **Manual:** reject spam, competitors fishing for the method, sites we cannot help (no public site, login wall, illegal content); decide whether a redirected domain is the right one |
| 3 | Define the question set (3 questions) and competitors | from terms plus industry | **Partly** | Script/LLM drafts 3 to 5 questions from the terms. **Manual:** pick the final 3, check they sound like a real customer, set region and language, name 2 to 3 real competitors (check they exist and serve the same area) |
| 4 | Fetch status, redirects, headers, raw HTML | `curl -sIL`, saved HTML | **Yes** | |
| 5 | robots.txt, sitemap, AI-crawler rules | fetch and parse per user agent | **Yes** | Whether a block is intended is the customer's decision; the report only states the state |
| 6 | Content visible without JavaScript | raw HTML vs rendered DOM (headless browser) | **Yes** | Flags if the main text is missing in the raw HTML |
| 7 | Title, description, headings, canonical, `lang`, Open Graph | HTML parser script | **Yes** | Whether text fits the search terms is judged in step 18 |
| 8 | Lighthouse, 3 runs, mobile and desktop | PageSpeed Insights API or Lighthouse CLI | **Yes** | Median of 3; stores tool version and date |
| 9 | Field data (Core Web Vitals) | PSI / CrUX | **Yes** | Often missing for low-traffic sites; report "no data" |
| 10 | Structured data extraction and validation | JSON-LD parser, Schema Markup Validator | **Partly** | Script: extracts nodes, lists errors, compares name/address/phone with the visible page. **Manual:** open the Google Business Profile and one directory to compare data, run the Rich Results Test by hand where the API is not used, decide whether a mismatch is a real problem or a format difference |
| 11 | Accessibility, conspicuous items | axe-core CLI, WAVE | **Partly** | Script: axe results and counts. **Manual:** keyboard walk-through (Tab, focus visible, skip link), zoom to 200 %, check that flagged items are real (false positives), word the result as "conspicuous items" and never as conformity |
| 12 | Image check (format, size, `alt`, dimensions) | script over the DOM and network log | **Yes** | |
| 13 | AI answers: run the questions on the assistants | LiteLLM / Promptfoo (API); manual in the apps | **Partly** | Script: API runs (search-enabled models where available). **Manual:** ask the same questions in the ChatGPT, Gemini and Google AI Overviews/AI Mode web apps (logged out or fresh profile, German UI, customer's region), copy each answer and its sources into the log file, note the date and mode |
| 14 | Repeat each question and log answers | LiteLLM script with `RUNS`, Promptfoo `--repeat` | **Yes** | For the manual apps: repeat at least twice by hand |
| 15 | Mention, citation and competitor counts | string match, parsed sources | **Yes** | Rough count; step 16 corrects it |
| 16 | Fact accuracy of answers (address, services, hours) | Promptfoo assertions | **Partly** | Script: asserts fixed facts, flags missing brand and wrong city. **Manual:** read a sample of answers in full, judge half-right or negative mentions, mark hallucinated claims, count only what a customer would actually see |
| 17 | Judge causes ("why not named") | reading evidence from steps 4-12 | **No** | **Manual:** link each gap to causes visible on the site (no crawlable text, missing data, blocked crawler, thin or inconsistent business data, no clear answer text). Word as "possible cause", never as proof; assistants also pick sources we cannot see |
| 18 | Rate findings (impact, certainty, effort) and pick the top three | rule-based pre-sort, then a person | **Partly** | Script: sorts by a scoring table (impact x certainty / effort). **Manual:** choose the final three, make sure they matter for this business (not just for the tool), check the free report names problems but gives no how-to |
| 19 | Write summary and finding texts | template plus LLM draft | **Partly** | Script/LLM: drafts in the report template from the evidence file. **Manual:** edit every sentence: plain language, correct facts, no promised rankings or citations, no claims the evidence does not support, customer's name and URL correct, German/English as requested |
| 20 | Screenshots and evidence snippets | headless browser screenshots | **Partly** | Script: captures pages, snippets and AI answers. **Manual:** choose and crop; remove personal data of third parties, other customers' names and anything that reveals the paid method |
| 21 | Build the PDF from the template | Markdown or HTML template to PDF | **Yes** | Template not built yet (section 8) |
| 22 | Quality check before sending (checklist in section 3) | checklist | **No** | **Manual:** run the checklist, open the PDF, click every link, check the date and the URL, read it once as the customer; sign off in the log |
| 23 | Send the report to the customer | mail, personal text | **No** | **Manual:** write a short personal mail, attach the PDF, send from the studio address, offer the call. Auto-send would contradict "prepared personally" |
| 24 | Record the delivery (date, request, no extra personal data) | log / todo | **Partly** | Script: writes date, domain hash and status. **Manual:** note the follow-up date and any reply; delete data per `docs/privacy-actions.md` retention |
| 25 | Re-test after the work (paid scope) | same scripts, same question set | **Yes** | Needs the fixed question set from step 3 |
| 26 | Before/after comparison | diff of the two result files | **Partly** | Script: builds the table and the percentages. **Manual:** explain what changed and why, and state honestly where nothing improved |

Summary: steps 4-9, 12, 14, 15, 21 and 25 run unattended. Steps 17, 22 and 23 stay human. Every **Partly** step is
"script prepares, person decides". Honest framing for the website text: the report is **prepared personally**;
automation speeds up measuring, judgement and sending remain ours.

### 7.1 Automation solution (Node.js)

A small Node.js command-line pipeline runs all **Yes** steps and the collecting or drafting part of every **Partly**
step (fetch and markup checks, Lighthouse, axe, AI answers, screenshots, scoring, draft text). It writes the results
into one dated work folder and stops at a generated `REVIEW.md` that lists the manual tasks above as tick boxes.
Only after those are ticked does a second command build the PDF. Nothing is sent to the customer automatically.
It runs locally or in CI as a separate tool, not inside the Next.js site.

Details (requirements, libraries, folder layout, code sketches, flow, design rules, build order):
[`ai-visibility-automation.md`](ai-visibility-automation.md).

---

## 8. Open decisions

- Report template format (Markdown to PDF script, or a fixed document template). Not built yet.
- Which assistants and modes the public text promises; the site lists ChatGPT, Claude, Perplexity, Gemini and
  Google AI answers, so the report must cover all five or say which were unavailable.
- Whether to keep a small history of question sets per industry to speed up repeat work (customer data only with
  consent; see `docs/privacy-actions.md`).
