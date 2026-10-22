# AI visibility analysis (GEO / AEO): report layout, tools and method

Working document. Not deployed (`docs/` is never shipped). Public wording lives in `src/content/{de,en}.json`
(`services.geo`, `analysis`); scope and prices in [`../services-deliverables.md`](../services-deliverables.md).

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
   - Core Web Vitals: LCP, CLS, INP from lab data (and field data if the site has enough traffic).
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

## 4. Open decisions

- Report template format (Markdown to PDF script, or a fixed document template). Not built yet.
- Which assistants and modes the public text promises; the site lists ChatGPT, Claude, Perplexity, Gemini and
  Google AI answers, so the report must cover all five or say which were unavailable.
- Whether to keep a small history of question sets per industry to speed up repeat work (customer data only with
  consent; see `docs/privacy-actions.md`).
