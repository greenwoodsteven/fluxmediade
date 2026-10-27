# Services, deliverables and technical implementation

Working document for deciding what each offer contains. It is not deployed (`docs/` is never shipped).
Source of the current wording: `src/content/{de,en}.json` (`services.*`, `analysis`). The "from" prices live in the
same JSON files (see [Where prices are set](#where-prices-are-set)); they are calculated in
[Price model](#price-model-at-50--hour).

Status: **proposal**. The technical sections describe how we would build it and should be checked against what
you want to promise publicly (anything you list becomes a commitment).

## Overview

| # | Offer | Price model | Start with | Main deliverable |
|---|-------|-------------|------------|------------------|
| 0 | Free start-page check | free | form on `/seo-analyse-kostenlos/` | one-page PDF about the home page only |
| 1 | AI visibility (GEO / AEO) & SEO, three packages (Basic 250 / Standard 450 / Complete 890 €) | fixed price, from € 250 | free check or request | analysis of several pages + implementation package |
| 2 | Accessibility (BFSG / WCAG 2.2) | fixed price, from € 400 | questionnaire | audit + prioritised fixes |
| 3 | Website relaunch | fixed price, from € 2,000 | analysis of existing site | rebuilt site, redirects, handover |
| 4 | WordPress optimisation & support | fixed price / monthly, from € 400 | audit | faster, safer WordPress |
| 5 | Landing page | fixed price, from € 700 | briefing | one finished page |
| 6 | AI chatbot | per project, from € 1,500 | conversation | chatbot on your own content |
| 7 | Automation with n8n | per project, from € 500 | conversation | documented n8n workflows |
| 8 | Custom web development | hourly, from € 50 / hour | conversation | agreed development work |

Rule for the split between 0 and 1: the free check **finds and names** problems on the home page; the paid
analysis **covers the whole site and does the work**. The free report must not be a how-to guide for the paid one.

---

## 0. Free start-page check (SEO & AI)

Lead magnet. Shown on `/seo-analyse-kostenlos/` and on the AI-visibility page as "Start with the free check".

**Scope:** the home page only (one URL, the one entered in the form).

**Deliverables**
- One-page PDF report, within 48 hours (2 working days), prepared personally in about an hour.
- Technical basics of the home page: title, description, headings, indexing, mobile, Core Web Vitals.
- Structured data on the home page: present, missing or faulty (named, not fixed).
- AI spot check: three questions in ChatGPT, Claude, Perplexity, Gemini and Google AI answers, with what was returned.
- Accessibility: the most visible barriers on the home page.
- The three biggest findings, each with the reason it matters. No step-by-step fix instructions.
- Offer of a call; the paid analysis (offer 1) as the next step.

**Not included:** other pages, implementation, ranking promises, legal advice.

**Terms:** own website only, one analysis per company and domain within 90 days, limited places per week, we may
decline, processed after the email address is confirmed (see below).

**Technical implementation**
- Form: static Next.js page, own validation, proof-of-work challenge (`/api/challenge.php`), no third-party captcha.
- Back end: PHP on netcup (`api/analysis.php`, `confirm.php`, `lib/audit.php`); request is stored until the email
  link is confirmed (max. 48 h), then mailed to the studio; domain stored only as a hash for 90 days; weekly cap.
- Our work: Lighthouse and axe on the home page, view of the rendered HTML and JSON-LD, three manual AI queries,
  report written from a fixed template (to keep it to about an hour).
- Data protection: no tracking, no third-party requests; privacy text lists what is stored and for how long.

---

## 1. AI visibility (GEO / AEO) & SEO, multi-page analysis

Why SEO is part of it: AI answers draw on search indexes (Google, Bing) and on crawled pages, so indexing, technical
SEO, on-page basics and speed are preconditions for being cited. The analysis therefore covers both, with the same
measurements. Link building, backlinks and ads are not part of it.

Paid. Link back to the free check: "Not sure yet? The free start-page check covers your home page."

**Scope:** an agreed set of pages, typically the home page plus up to [N] representative pages (one per template or
service). Larger sites by quote.

**Deliverables**
- Written analysis of all agreed pages (technical and on-page SEO: titles, descriptions, headings, internal links,
  indexing, canonicals, Core Web Vitals).
- Core Web Vitals and Lighthouse recommendations per page: LCP, CLS and TBT (lab; INP from field data where
  available), plus the Lighthouse improvement suggestions with estimated savings, reviewed against the real site.
- Structured-data audit for the whole site with a corrected JSON-LD set (Organization, LocalBusiness, Service, FAQ,
  Article, BreadcrumbList as they apply).
- AI visibility test: [N] questions that fit your business across ChatGPT, Claude, Perplexity, Gemini and Google AI
  answers, documented with dates, so the result can be compared later.
- Content review: which pages answer real questions clearly enough to be cited, with concrete rewrite notes.
- Prioritised action list (impact and effort).
- **Package "Audit & Quick Wins" (implementation):** the top measures carried out on the site.
- Re-test of the same questions after [N] weeks and a short before/after note.
- Call to explain the results.

**Not included / honest limits:** no guaranteed placement in AI answers or search results; no backlink packages or ad management; the Lighthouse SEO category checks basics only and is not a ranking prediction.

**Technical implementation**
- Crawl and measure: Lighthouse (lab data: Core Web Vitals, SEO and best-practice audits, opportunities and diagnostics), PageSpeed Insights field data, axe, response headers, robots.txt and sitemap check, rendered-HTML check
  (is the content present without JavaScript?).
- Structured data: JSON-LD generated from one data source and validated; no plugin dependence on custom builds,
  plugin settings or a small mu-plugin on WordPress.
- Crawler access: robots.txt rules for AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended)
  as the customer decides; optional `llms.txt`.
- Content structure: one H1, question-style H2s, short answer first, FAQ blocks with matching `FAQPage` markup.
- Speed: image formats (AVIF/WebP), caching headers, script weight.
- Documentation: before/after table, JSON-LD files and a list of changed templates, delivered as PDF plus the code.

---

## 2. Accessibility (BFSG / WCAG 2.2 AA)

**Deliverables**
- First: honest statement whether the BFSG applies to the business (not legal advice).
- Audit against WCAG 2.2 level AA: automated (axe, Lighthouse) plus manual (keyboard only, screen-reader sample,
  contrast, labels, focus order, zoom and reflow).
- Prioritised list of barriers with fixes in plain language.
- On request: remediation and a draft accessibility statement.

**Technical implementation**
- Tools: axe, Lighthouse, keyboard walk-through, NVDA/VoiceOver sample on key flows (navigation, forms, checkout).
- Fixes at the source: semantic HTML, landmarks, labels and error text tied to fields (`aria-describedby`,
  `aria-invalid`), visible focus, contrast tokens, alt text, reduced-motion support, accessible names for controls.
- Not an overlay plugin; changes go into the templates or theme.
- Re-test after fixing, retest results attached to the statement.

---

## 3. Website relaunch

**Deliverables**
- Concept and page structure from your content.
- Lean, accessible build (WordPress or custom, decided together).
- 301 redirects from every old URL (rankings preserved as far as possible).
- Training and handover; post-launch check after launch.

**Technical implementation**
- Custom: Next.js + React static export (HTML generated at build time, no server runtime), Tailwind CSS,
  self-hosted fonts, no third-party requests, PHP endpoints for forms on shared hosting; German and English routes if
  needed. Deployment by rsync to a release folder with an atomic symlink switch and rollback.
- WordPress: lean theme, few plugins, caching, image optimisation, accessibility from the start.
- Content: for non-technical editors a headless CMS (e.g. Payload) or WordPress; chosen by who maintains content.
- Migration: URL inventory of the old site, redirect map in `.htaccess` (or server config), canonical and sitemap,
  Search Console submission and post-launch crawl check.
- Quality gates before launch: Lighthouse, axe, security headers (CSP, HSTS), HTTPS with www canonical.
- Shops: WooCommerce or Shopify by individual quote; payment with Stripe or PayPal as discussed.

---

## 4. WordPress optimisation & support

**Deliverables**
- Plugin and theme audit.
- Load-time optimisation (Core Web Vitals).
- Schema markup and basics for AI visibility.
- Fixing the main accessibility barriers.
- Security: updates, backups, hardening.
- Optional monthly support.

**Technical implementation**
- Staging copy first, changes tested there, then deployed; full backup before every change.
- Performance: remove or replace heavy plugins, caching layer, image conversion and lazy loading, critical CSS,
  database clean-up, PHP version and object cache where the host allows it.
- Security: update routine, least-privilege users, login hardening, file permissions, security headers, restore test.
- Monitoring for monthly support: uptime check, update log and a short monthly note.
- Terms: one-off work needs no contract; support term agreed openly.

---

## 5. Landing page

**Deliverables**
- One page with your copy and images.
- Contact form with confirmation.
- Mobile, fast, accessible; legal pages on request.

**Technical implementation**
- Static page (Next.js export or plain HTML/CSS), under 150 KB of JavaScript, AVIF/WebP images with correct sizes.
- Form handled by a PHP endpoint with honeypot, rate limit, proof-of-work and email confirmation (same stack as this
  site); mails over the customer's own SMTP.
- No cookies or trackers by default, so no consent banner; analytics only if the customer wants it, privacy-friendly.
- Hosting on the customer's account or ours; deployment script and handover notes included.

---

## 6. AI chatbot

**Deliverables**
- Concept and review of the data basis.
- Implementation based on your own content (RAG).
- Data-protection and AI Act labelling notes.
- Training.

**Technical implementation**
- Content is split, embedded and stored in a vector index; each answer is generated from retrieved passages and
  cites them; fallback "I don't know, please contact us" and handover to the contact form.
- Model provider and hosting chosen per project with EU locations and a data processing agreement in mind.
- Guardrails: scope limit to the customer's topics, rate limit, logging policy decided with the customer (default:
  no storage of personal data), clear "this is an AI assistant" label (AI Act).
- Front end: small widget loaded from the customer's own domain; no third-party script by default.
- Operation: content refresh process, answer-quality test set, monthly cost estimate for the model usage.

---

## 7. Automation with n8n

**Deliverables**
- Joint mapping of the workflow.
- Implementation in n8n.
- Documentation and handover.

**Technical implementation**
- n8n self-hosted (Docker) or n8n cloud, decided per project and by where the data may be processed.
- Triggers by webhook, schedule or mailbox; steps for forwarding enquiries, syncing data, generating reports.
- Error handling: retries, failure alert by email, execution log; credentials in the n8n credential store, never in
  workflow text; backups of workflows as JSON in git.
- Handover: workflow diagram, runbook, who gets alerts, how to pause a workflow.

---

## 8. Custom web development (hourly rate)

Simple or complex: "we can help". For work that does not fit a fixed-price offer: features, integrations,
extensions to an existing application, or ongoing development. Live on `/leistungen/webentwicklung/` and
`/en/services/custom-development/` (JSON key `services.custom`).

**Rate:** from € 50 per hour (no VAT charged, small-business rule §19 UStG). € 50 applies to projects with a larger number of hours per month; shorter jobs are billed at a higher hourly rate.

**Deliverables**
- Written estimate with a range before work starts; no work beyond the agreed budget without your approval.
- Work tracked per task; a timesheet with every invoice.
- Working software in your repository with tests where it makes sense; short handover notes.
- Optional reserved hours per month at the same rate.

**Technical implementation (typical stack)**
- Front end: React / Next.js, TypeScript, Tailwind CSS, accessibility and performance budgets in the build.
- Back end: Node.js, PHP, or headless CMS (Payload CMS on Cloudflare Workers with D1 and R2, as in the pdf-to-fax
  project); REST/JSON APIs.
- Integrations: Stripe payments, SMS and fax via Telnyx, email (SMTP), n8n, WordPress REST.
- Delivery: git workflow, pull requests, CI with tests, preview and production environments, rollback.
- Security and privacy: input validation, rate limiting, security headers, secrets outside the repository,
  EU-hosted data where required.

**Also used for:** scope changes inside a fixed-price project, agreed in advance and billed at the same hourly rate.

---

## Price model at € 50 / hour

Hourly rate: **from € 50 net** (the € 50 applies to projects with a larger number of hours per month; shorter jobs are billed higher, and the "from" prices below assume € 50). The studio uses the small-business rule (§19 UStG), so no VAT is added and net equals
the amount the customer pays. If the studio leaves that rule, every price below needs +19 % VAT shown separately.

"From" price = hours of the smallest sensible package × € 50, rounded to a clean figure. Hours are estimates
(include about 15 % buffer for revisions and communication); check them against your first real projects.

| Offer | Smallest package covered by "from" price | Est. hours | From price | JSON key (`price`) |
|---|---|---|---|---|
| 0 Free start-page check | one-page PDF, home page only | 1 | free (cost to studio: € 50 of time) | – |
| 1 AI visibility | Standard package: analysis of the agreed pages (5 h), three quick wins carried out (3 h), call and report (1 h); Basic 250 € and Complete 890 € per the ad and `services.geo.compare` | 9 | 450 € (Standard) | `services.geo.price` shows "from 250 €" |
| 2 Accessibility | audit of up to 5 pages incl. manual checks and report; fixes are extra, at the hourly rate | 8 | from € 400 | `services.a11y.price` |
| 3 Website relaunch | small site up to about 5 pages: concept 4 h, build 24 h, content and migration 6 h, redirects and QA 4 h, handover 2 h | 40 | from € 2,000 | `services.relaunch.price` |
| 4 WordPress | plugin and speed audit with the main fixes; monthly support about 2 h = € 100 / month, quoted separately | 8 | from € 400 | `services.wordpress.price` |
| 5 Landing page | briefing 1.5 h, build 8 h, form 1.5 h, revision 1 h, QA and publish 2 h | 14 | from € 700 | `services.landing.price` |
| 6 AI chatbot | concept 4 h, RAG setup 16 h, guardrails and labelling 4 h, testing 4 h, handover 2 h; model usage costs run separately | 30 | from € 1,500 | `services.chatbot.price` |
| 7 Automation | one n8n workflow: mapping 2 h, build 6 h, documentation and test 2 h | 10 | from € 500 | `services.automation.price` |
| 8 Custom development | billed by the hour, estimate with range first | – | from € 50 per hour | `services.custom.price` |

Observations
- **Free check:** each check costs about an hour (€ 50). With up to 10 confirmed requests a week the cap means at most
  about 10 h a week. Break-even: roughly one in nine checks has to turn into a 450 € (Standard) analysis.
- **Rate level:** € 50 an hour is at the low end for freelance web development in Germany. It works as an entry
  price, but leaves little room for unbilled time (quotes, calls, support). Compare after the first three projects
  and adjust the hours, not only the rate.
- **Fixed prices carry the risk:** a fixed price at 40 h loses money if the job takes 55 h. Use the "scope changes at
  the hourly rate" rule from offer 8 for anything beyond the agreed list.
- **Large sites:** relaunch above about 10 pages, shops and chatbots grow by the hour; the "from" price is only the
  entry point and every project gets a written quote.

### Where prices are set

The price shown on service cards, service pages and the home page is read from the content JSON, one value per
language and service:

| Place | Key |
|---|---|
| `src/content/de.json` | `services.<id>.price`, e.g. `"ab 450 €"` |
| `src/content/en.json` | `services.<id>.price`, e.g. `"from €450"` |

`<id>` is one of `geo`, `a11y`, `relaunch`, `wordpress`, `landing`, `chatbot`, `automation`, `custom`. Edit the string
in both files (number format: German `2.000 €`, English `€2,000`). The VAT note under the price on service pages is
`ui.vatNote` in the same files.

---

## Open decisions

1. Prices: check the estimated hours and the "from" prices above, then adjust `services.<id>.price` in both JSON files.
2. Page limit `[N]` for the multi-page analysis and the re-test interval.
3. Which technical claims you are happy to publish (for example Payload, Cloudflare, RAG providers).
4. Site changes after you approve this document (not yet done):
   - AI-visibility page: add "start with the free start-page check", replace the report items in the deliverables
     with the multi-page analysis and the implementation package.
   - Each service page: add a "Technical implementation" section.
   - Analysis page: state clearly that the free check covers the home page only.
