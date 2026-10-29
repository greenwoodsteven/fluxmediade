# Development to-do list

Status: **2026-10-19**, commit `bc6e803`, site live at https://www.fluxmedia.de (Next.js static export, PHP endpoints on netcup).
This list collects every open point from the audits, the legal and privacy documents, and the working notes.

- Priority: **P1** do next (blocks trust or compliance), **P2** soon, **P3** later or optional.
- Effort: **S** under 1 hour, **M** a few hours, **L** a day or more.
- Type: **code** (changes in this repository), **content** (copy, images), **ops** (server, accounts), **legal** (needs a lawyer, Steuerberater or DPO).
- "Source" points at the document or the conversation topic where the item comes from.

## 1. Compliance and trust (P1)

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 1 | P1 | ops | **Daily cron job** for `api/cleanup.php` in the netcup panel | job runs, `cleanup done` printed once by hand, `storage/pending` empties after 48 h | S | privacy-actions #3 |
| 2 | ~~P1~~ **Done 2026-10-21** | ops | Check `storage_dir` is **above the document root**, mode 700, git-ignored, and allowed by `open_basedir` | `ls -ld` shows `drwx------`; `/api/challenge.php` returns JSON | S | privacy-actions #4 (live: `open_basedir` widened, storage inside the clone, `/api/challenge.php` works) |
| 3 | P1 | ops | **netcup processor agreement** (AVV) confirmed and filed; log retention at netcup found out | PDF saved, policy section "Hosting und Server-Logfiles" names the real retention if it is long | S | privacy-actions #1, #2 |
| 4 | P1 | legal | **Legal review** of the privacy policy and the Impressum | written OK or list of changes from a lawyer or DPO | M | legal-audit #3, #4 |
| 5 | P1 | content | **Portfolio references**: ask Krieger Digital for OK, change the entry text to "im Auftrag von Krieger Digital", crop the Höffner screenshot (no photo of people, no time-limited offers), add the caption "Screenshot, Stand Oktober 2026. Marken und Inhalte gehören den jeweiligen Inhabern." | reply saved, `de.json`/`en.json` updated, `hoeffner_720x480.jpeg` and `moebel-kraft_720x480.jpeg` re-cropped | M | legal-audit #2, section 6a |
| 6 | P1 | ops | **Rotate the old SMTP password**; confirm it exists only in `api/config.php` | new password in use, old one invalid | S | README open items, legal-audit section 8 |
| 7 | P1 | ops | Browser check on the live site: **no cookies, no storage, requests only to `www.fluxmedia.de`** | developer tools *Application* and *Network* tabs are clean | S | legal-audit section 5 |
| 8 | P1 | ops | **SPF, DKIM and DMARC** for `fluxmedia.de` so the confirmation mails arrive | test mail passes the three checks (mail-tester or similar), analysis confirmation lands in the inbox | S | legal-audit section 8 |
| 9 | P1 | legal | **Impressum** completeness: § 18 MStV line once the Ratgeber exists, dispute-resolution statement, VAT ID vs small-business rule | Steuerberater and lawyer confirm; `de.json`/`en.json` updated | S | legal-audit #4 |
| 51 | P1 | decision | **Contracting party and insurance**: ask exali in writing (question list in legal-audit 9a) who is insured (owner as Einzelunternehmer vs Fluxmedia GbR) and for which activities; talk to the co-partner; ask the Steuerberater (freiberuflich or gewerblich, invoicing per entity). Decide before changing Impressum, quotes or invoices | written answer from exali, decision recorded (option A, B or C), then Impressum, privacy text and quote wording changed together | M | legal-audit #13, section 9a |

### 1a. Impressum, Widerruf and Datenschutz under option D

Option D (`legal-audit.md` 9a) is chosen (owner, 2026-10-25). Texts: `docs/impressum-option-d.md` and `docs/widerruf-datenschutz-option-d.md`.
Legend: ✅ done, ◐ partly (see Status), ⬜ open. **The code changes are committed, pushed and deployed (2026-10-25).**

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 52 | P1 | legal | ◐ **Insurance check**: add the "IT-Haftpflicht Bedingungen exali 2026-03" to `docs/insurance/`; read territorial scope, exclusions (AI work, promised rankings), retroactive cover; send the question list to exali and get the answers in writing | scope and activity list confirmed in writing — **Status:** Scope read in the Bedingungen: **worldwide for financial losses**, US limits for personal/property damage. Still open: written answer from exali on the declared activity list (web, SEO, AI, chatbots, automation) and on retroactive cover. Unlimited Nachmeldefrist found (Bedingungen A.2) | S | legal-audit 9a, policy EX.MPI.52981 |
| 53 | P1 | legal | ◐ **Steuerberater**: freiberuflich or gewerblich for web, SEO and AI work; "Fluxmedia" as business designation in the Gewerbeanmeldung; combined turnover for § 19 UStG and the 30,000 € insurance band; free use of the GbR brand and domain (Nutzungsentnahme, Abfärbung) | written answer — **Status:** **Decision (owner):** all work is received through the Einzelunternehmer for now, because of the insurance; specific jobs are handled by the GbR. Steuerberater confirmation of freiberuflich/gewerblich and of the § 19 UStG / 30,000 € band still open | S | legal-audit 9a |
| 54 | P1 | decision | ✅ **Co-partner**: written agreement to option D, to the new Impressum, to being named on the GbR contact page, and to the GbR staying available for freiberufliche orders | written consent — **Status:** Co-partner is passive and accepts the owner's decisions. Optional: short written note for the file | S | impressum-option-d section 3 |
| 55 | P1 | decision | ✅ **Businesses only or consumers too**: businesses only avoids the Widerrufsbelehrung and the Widerrufsbutton (§ 356a BGB); consumers need both | decision recorded — **Status:** Consumers as well: Widerrufsbelehrung, Muster-Widerrufsformular and Widerrufsbutton are required (item 61) | S | widerruf-datenschutz-option-d section 1 |
| 56 | P1 | decision | ✅ **Publish the insurance line** in the Impressum or only in quote/AGB (§ 2 DL-InfoV) | decision recorded — **Status:** Insurance information goes into the quote page and the FAQ (no AGB exist; § 2 DL-InfoV), **not** into the Impressum | S | impressum-option-d 2a |
| 57 | P1 | content | ✅ **Fill the placeholders** from the Gewerbeanmeldung: full name, address, phone, USt-IdNr. (if any), territorial scope | no `[...]` left in the texts — **Status:** Filled in `config/site.local.json` (git-ignored): owner, address, VAT ID DE447203035, GbR data. The Steuernummer is **not** published anywhere on the site | S | impressum-option-d section 1 |
| 58 | P1 | code | ✅ **Impressum DE/EN** in `de.json`/`en.json` and `config/site.local.json` (operator, Inhaber, Streitbeilegung, GbR block; insurance goes to the quote page and FAQ, decision 56); remove the partner list and the old OS-platform text | page shows the new text — **Status:** Impressum names Fluxmedia, Inhaber Steven Greenwood; GbR only as a short block with a link to its contact page. Deployed 2026-10-25 | M | impressum-option-d section 2 |
| 59 | P1 | code | ✅ **GbR contact page** (`/kontakt-gbr/`) with its own § 5 data, linked from the Impressum and the footer; no use of the owner's quote form or mailbox | page live, no insurance line on it — **Status:** `/kontakt-gbr/` and `/en/contact-gbr/` built, with GbR data and e-mail gbr@fluxmedia.de. Deployed 2026-10-25 | M | impressum-option-d section 3 |
| 60 | P1 | code | ✅ **Privacy page**: controller changes to the owner, GbR named as controller only for its contact page; netcup processor contract stays | page names the right controllers — **Status:** Controller is the owner; the GbR is named as controller for its own contact page; new section on withdrawals; date 25.10.2026 | S | legal-audit 9a |
| 61 | P1 | code | ✅ **Widerruf**: if consumers are accepted, add the page with Widerrufsbelehrung and Muster-Widerrufsformular, a footer link and the **Widerrufsbutton**; if businesses only, add the B2B sentence to the quote page and AGB | matches decision 55 — **Status:** `/widerruf/` with instruction, model form, online form (`api/withdrawal.php`) and footer link "Vertrag widerrufen" on every page. Lawyer should check the label wording and the § 356 Abs. 4 BGB text (item 68) | M | widerruf-datenschutz-option-d sections 2 and 3 |
| 62 | P1 | code | ✅ **Quote and confirmation mails**: operator in the footer of the auto-reply (`api/lib/bootstrap.php`), contracting party named in the quote before the contract | mails name the owner — **Status:** All automatic replies (auto-reply, analysis confirmation, withdrawal receipt) are now multipart HTML + plain text, with the owner in the sign-off and a footer (owner, optional address, Impressum and privacy links) and the logo embedded as CID PNG (`api/lib/logo-email.png`, no remote image). Studio notifications stay plain text. Committed and pushed (d44c17d). Server `api/config.php` needs `owner`, `owner_address_de`, `owner_address_en` and `to` (see `api/config.example.php`). **Conflicts with item 72:** 72 says the name stays out of automatic replies except the withdrawal confirmation; the mails currently name the owner in all of them | S | impressum-option-d section 6 |
| 63 | P1 | content | ✅ **JSON-LD and site config**: `legalName`, organisation node, `partners`, `vatId`, address | structured data matches the Impressum — **Status:** JSON-LD and footer read the new config (name Fluxmedia, owner as Person on the About page) | S | impressum-option-d section 6 |
| 64 | P2 | content | ⬜ **Invoice and AGB templates**: owner's full name and address, tax number, § 19 UStG note, price wording net/gross | template ready — **Status:** No AGB exist; invoice template is outside this repository | M | impressum-option-d section 4 |
| 65 | P2 | content | ◐ **Accessibility statement**: contact and responsible body | statement matches — **Status:** No GbR mention in the statement; check the contact wording when deploying | S | impressum-option-d section 6 |
| 66 | P2 | ops | ⬜ **Kleinanzeigen and other profiles**: Impressum, Widerruf and Datenschutz blocks, commercial marking, price wording, no guarantee claims; same for Google Business Profile, LinkedIn, directories | profiles match the Impressum — **Status:** After deploy | S | widerruf-datenschutz-option-d section 5 |
| 67 | P2 | ops | ◐ **Deploy and verify**: `./deploy/upload.sh`, `git pull` and the server `api/config.php` (`'to'`) if the mail address changes; check the Impressum, privacy and Widerruf pages live, run the axe/Lighthouse check | pages live and checked — **Status:** deployed 2026-10-25 (reported by the owner); live checks (pages, redirects, test withdrawal, analysis form, axe/Lighthouse) still to be confirmed | S | deploy/README.md |
| 68 | P2 | legal | ⬜ **Lawyer check** of the final texts, especially § 356 Abs. 4 versus Abs. 6 BGB, the Widerrufsbutton, and whether the Vermögensschaden-Haftpflicht counts as Berufshaftpflicht under § 2 DL-InfoV | written feedback | M | widerruf-datenschutz-option-d section 3 |
| 69 | P3 | ops | ⬜ **Insurance upkeep**: update the insurance text (quote page and home FAQ in `de.json`/`en.json`) when the policy changes or ends (01.10.2027); annual Jahresmeldung; report turnover above 30,000 € | calendar reminder set | S | impressum-option-d 2a |
| 70 | P1 | code | ✅ **Page "Über mich"**: `/ueber-mich/` and `/en/about-me/` (was `/ueber-uns/`, `/en/about/`), focus areas as the main block plus a short general background (no CV details), 301 redirects in `public/.htaccess`, nav label | page live, old URLs redirect — **Status:** deployed 2026-10-25 | M | owner request 2026-10-25 |
| 71 | P1 | decision | ✅ **Employer on the public page**: no longer an issue. The page no longer names employers, clients, dates or publications, only general descriptions | — | S | legal-audit 6a |
| 72 | P2 | code | ✅ **Owner's name only where needed**: removed from footer, copyright, contact page, quote page, GbR page and automatic replies; kept in Impressum, privacy, Widerruf page, About me and the withdrawal confirmation | see `impressum-option-d.md` 0a | S | owner request 2026-10-25 |

## 2. Accessibility (P1 to P2)

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 10 | P1 | code | ◐ **Manual accessibility pass**: keyboard only, screen reader (NVDA or VoiceOver), 200 % zoom, reduced motion, WAVE | findings listed in `docs/audits/` and fixed — **Status:** Keyboard, 200 %/400 % zoom, reduced motion and axe on 18 pages done 2026-10-27, findings in `docs/audits/2026-10-15-lighthouse-axe.md` (follow-up) and fixed (focus after success, wizard focus, pausable word cloud, cloud contrast, 320 px reflow). **NVDA, VoiceOver and WAVE still to be run by hand** | L | audit report, accessibility statement |
| 11 | P1 | code | ◐ Test all **form states**: error, success, sending, server error, the quote wizard steps, the confirmation mail flow | each state checked with keyboard and screen reader — **Status:** All states (error, sending, server error, success) and all quote steps checked with the keyboard and in the DOM on 2026-10-27, focus bugs fixed. **Not yet listened to with a screen reader** | M | audit report |
| 12 | ~~P2~~ **Done 2026-10-27** | code | ✅ **Hero text contrast** (axe "incomplete"): measure the real contrast over the image, adjust the overlay if under 4.5:1 | measured ratio noted in the audit, axe incomplete cleared or explained — **Status:** Measured 5.00:1 worst case (whole image, 35 % over `#222`); noted in the audit, axe incomplete gone | S | audit report |
| 13 | P2 | content | ✅ **Update the accessibility statement** after items 10 to 12 (date, result, remaining gaps) | `pages.a11yStatement` updated in DE and EN — **Status:** `a11yStatement` updated in DE and EN, 27 Oct 2026 (what was tested, remaining gaps: screen readers, WAVE) | S | legal-audit section 10 |

## 3. Performance (P2)

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 14 | ~~P2~~ **Done 2026-10-27** | code | ✅ **LCP under 2.0 s on mobile** on all pages (now 2.0 to 2.8 s; `/referenzen/` is the slowest at 2.8 s, the home page 2.4 s) | Lighthouse mobile shows LCP below 2.0 s on the 13 audited pages — **Status:** Measured on the live site 2026-10-27 (Lighthouse mobile, one run each): LCP 1.06 to 1.86 s on 10 of the 12 URLs (referenzen 1.44 s, was 2.8 s), **home DE 2.09 s and EN 2.08 s** still just over 2.0 s. Performance score 99 to 100 everywhere, CLS 0, TBT 9 to 35 ms **Update 2026-10-27 (deployed):** PageSpeed Insights reports 100 on mobile and 100 on desktop for `/en/` (owner). Treated as met; in throttled runs the home page LCP stays about 2.1 to 2.2 s, just over the strict 2.0 s | M | audit report (target in plan §5) |
| 15 | ~~P2~~ **Done 2026-10-27** | code | ✅ Reduce the **hero image** weight or priority (`fetchpriority`, size, preload), check that Inter swap did not delay the LCP text | LCP element identified per page and the cause fixed — **Status:** LCP element per page: the header logo (`logo_black.svg`, 7 KB), not the hero. The hero AVIF is 32 KB and done loading about 110 ms after the document, so image weight and priority are fine; Inter (55 KB) is preloaded. The remaining cost on home and `/ueber-mich/` is ~1.05 s of **element render delay** (not on `/referenzen/`: 47 ms), cause not yet pinned down; the SVG is a wrapper around an embedded PNG, tried 2026-10-27: PNG logo (`logo_black.png`, 4.8 KB, header and JSON-LD) on a local gzip build, 6 runs each: LCP under 2.0 s in 3 of 6 home runs vs 1 of 6 with the SVG (results flip between about 1.95 s and 2.4 s from run to run), so a small, not decisive gain; not yet measured live **Update 2026-10-27:** under real (DevTools) throttling the LCP element is the **hero image**, not the logo; it takes about 1.5 s because it shares the slow connection with about 132 KB of JS and the 55 KB font. A lighter hero (AVIF quality 28, 12.7 KB instead of 32 KB) made no difference (median 1.69 s vs 1.67 s), so image weight is not the bottleneck. The PNG logo is deployed. Next lever if ever needed: font and JS bytes. PageSpeed 100/100 (item 14), so closed | M | audit report |
| 16 | ~~P2~~ **Done 2026-10-27** | code | ✅ **`/referenzen/`**: fewer or lazier images below the fold, correct sizes | page weight images under 150 KB (total weight cannot be under 250 KB: JS, font and CSS already use about 200 KB), LCP under 2.0 s — **Status:** LCP 1.44 s met. Weight is 343 KB in total, of which images 122 KB (six AVIFs, 18 to 25 KB each); the fixed part (JS 132 KB, font 55 KB, CSS 6 KB) already uses about 200 KB, so "images under 150 KB (total weight cannot be under 250 KB: JS, font and CSS already use about 200 KB)" cannot be reached with images at all. Suggest changing the target to "images under 150 KB" **Update 2026-10-27:** target reworded to **images under 150 KB**; met (122 KB), LCP 1.44 s | S | audit report |
| 17 | P3 | code | ✅ Keep **JavaScript under 150 KB gzip** (about 141 KB now; the proof-of-work and form changes added to it) | measured after each feature — **Status:** JavaScript transfer on the live site 132 KB (7 scripts), under 150 KB; recheck after each feature | S | plan §5 |

## 4. Forms, backend and security (P1 to P2)

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 18 | P2 | code | Extend the **proof of work to the contact and quote forms** (same challenge as the free analysis) | `contact.php` and `quote.php` reject missing or reused solutions; forms solve the challenge in the background | M | form protection review |
| 19 | P3 | code | Optional **`smtp.debug`** setting that writes the PHPMailer connection log to the PHP error log | documented key in `config.example.php`, off by default | S | SMTP troubleshooting |
| 20 | P3 | code | Optional `smtp.verify_peer` setting (only if a mail server certificate ever fails) | default stays on | S | SMTP troubleshooting |
| 21 | P2 | code | **Content parity check**: a script that fails when `en.json` lacks a key that `de.json` has (the type cast hides this today) | `npm run lint` or a new `npm run check:content` reports missing keys | S | README, content section |
| 22 | P3 | code | **Contact/quote success messages** in line with the new confirmation flow (the free analysis already says "check your email") | wording checked in both languages | S | forms review |
| 23 | P3 | ops | Optional **error log** check after the first weeks (PHP warnings, mail failures) | log reviewed, noise fixed | S | operations |

## 5. Content and copy (P2)

Items from your review notes in `docs/content-de-en.md` that are **not applied yet** (adding Claude to the AI assistants was done).

| # | Pri | Type | Task | Notes | Effort |
|---|---|---|---|---|---|
| 24 | P2 | content | **Experience wording**: "over 10 years in web development, in Berlin and on Lake Constance" in `pages.home.sub` | the claim must match the facts (legal-audit section 7) | S |
| 25 | P2 | content | **Shops**: mention Stripe (and PayPal only if you have shipped it) in `services.relaunch` FAQ and `pages.quote.extra` | note the payment providers in the privacy policy when a shop is built | S |
| 26 | P2 | content | **Remote work**: say "personally on Lake Constance, remotely throughout Germany" | `areaServed` is already `DE` in the structured data | S |
| 27 | P2 | content | **LinkedIn link** on the about page, plus `sameAs` in the structured data | needs the profile URL; plain link, no embed | S |
| 28 | P3 | content | **Extra phone number with voicemail** | Impressum and privacy policy must name the provider; prefer an EU provider | S |
| 29 | P3 | content | **AI agents as a service**: decide whether to add it | only when it can be delivered; candidate for stage 2 | M |
| 30 | P2 | content | **Ratgeber (guide) articles**: write and publish the first ones | adds a § 18 MStV line to the Impressum; new route, content type and sitemap entries | L |
| 31 | P3 | content | **Hero image provenance and licence** | note the source; replace the image if it cannot be documented | S |
| 32 | P3 | content | **References**: add entries as clients agree (Bruno, Emotion, Yoga-Kreis need the same check as item 5) | | S |

## 6. Prices and offers (decisions)

| # | Pri | Type | Decision or task | Notes |
|---|---|---|---|---|
| 33 | P1 | decision | **Review the hour estimates and "from" prices** in `docs/services-deliverables.md` (at €50 per hour) and adjust `services.<id>.price` | an entry rate of €50 leaves little room for unbilled time; compare after the first three projects |
| 34 | P1 | decision | Confirm the **VAT wording** under prices (§ 19 UStG) with the Steuerberater; check consistency with the shown VAT ID | `ui.vatNote` in both JSON files |
| 35 | P2 | decision | **Consumers or businesses only?** If businesses only, say so on the site | otherwise price display, withdrawal right and terms apply (legal-audit section 7) |
| 36 | P2 | decision | Free analysis: **keep free**, or a paid deep audit as the next step; fill the placeholders `[N]` (pages in the multi-page analysis, re-test interval) | `docs/services-deliverables.md`, section 1 |
| 37 | P3 | decision | Estimate effort per service, effort of the free audit, and a preview example per service | from the review notes |

### 6a. Kleinanzeigen ad "SEO- & KI-Check": align the site with the ad

From the consistency checklist (section 4) in `docs/marketing/kleinanzeiger/ki-sichtbarkeit-anzeige.md`. The ad and the site must
not contradict each other, so items 73 to 75 go live **before or together with** the ad. Package details: `docs/competition-kleinanzeiger.md`, sections 5 and 7.

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 73 | P1 | content | ✅ **Package prices on the site**: `/leistungen/ki-sichtbarkeit/` (`services.geo` in `de.json` and `en.json`) still says "ab 450 €". Replace with the three-package comparison 250 / 450 / 890 € (Basic, Standard, Komplett); update `price`, `deliverables`, `priceDrivers`. Confirm the prices first (ad doc, section 5, point 1) | page shows the same packages and prices as the ad, DE and EN — **Status:** Done 2026-10-27 (not yet deployed): `services.geo` in DE and EN has `price` "ab 250 € / from €250", a package comparison table (`compare`: Basic 250, Standard 450, Komplett 890 with the rows from the ad), updated `deliverables`, `process`, `priceDrivers`, FAQ and free-check text. The table does **not** list the security check (items 75/76); until they are done the ad promises one thing more in Komplett than the site shows. Prices are still the proposals from the ad doc, section 5 | M | ad doc section 4; competition doc section 7, point 5 |
| 74 | P1 | content | ✅ **Hourly rate wording**: the site says "ab 50 € pro Stunde"; change `services.custom` (`price`, `priceDrivers`), the quote page, the FAQ and `docs/services-deliverables.md` to "70 € under 10 hours per month, 50 € above". Keep the rate **out of the ad** | site shows 70 € / 50 €, ad does not mention it — **Status:** Done 2026-10-27 (not yet deployed): `services.custom` price "50 € pro Stunde ab 10 Stunden im Monat, darunter 70 €" (first number stays the real minimum for the JSON-LD offer), `priceDrivers` and FAQ in DE and EN, `docs/services-deliverables.md`. SEO title and description keep "ab 50 €". No quote-page or home-FAQ text mentioned the rate. Still not in the ad | S | ad doc section 4; competition doc section 7 |
| 75 | P1 | content | ⬜ **Security check and accessibility add-on on the site**: describe the passive security check (headers, TLS, outdated software; about 150 €, part of Komplett) as a service or add-on, and mention on `services.a11y` that accessibility is included in Komplett | both described on the site as in the ad | M | ad doc section 4; competition doc section 7 |
| 76 | P1 | legal | ⬜ **Clear the passive security check with exali** (item 52) before the ad goes live; the ad says "rein passiv", keep it that way | written confirmation that the activity list covers it | S | ad doc section 4 |
| 77 | P2 | content | ✅ **Free check on the ad and `/seo-analyse-kostenlos/` in sync**: free check, 48 h, weekly limit worded the same in both (the page and the form notice) | same wording and numbers in the ad and on the page — **Status:** Checked 2026-10-27, already in sync, no change: `pages.analysis` and the form notice say home page only, PDF within 48 hours (2 Werktage), no obligation, limited number per week, one analysis per domain in 90 days; the ad uses the same facts | S | ad doc section 4 |
| 78 | P2 | content | ✅ **Widerruf text in sync**: the full block in the ad (3.2) and `/widerruf/` must be the same text; recheck after every change on either side, and after the lawyer check (item 68) | texts identical — **Status:** Compared paragraph by paragraph 2026-10-27: the ad block 3.2 matches `/widerruf/`. Only intended differences: the ad links the online form by URL instead of "this page", and the "who can withdraw" section is a note at the top. Not added: the consumer sentence asking for work to start within the period (ad doc 3.2); wait for the lawyer check, item 68 | S | ad doc section 4 |
| 79 | P2 | content | ✅ **Impressum data in sync**: ad block 3.1 against `/impressum/` (the Steuernummer is shown nowhere); confirm the phone number `+49 160 1222388` is the one for public display | blocks identical, phone confirmed — **Status:** Ad block 3.1 aligned with the site 2026-10-27 (address on one line, phone `+49-160-1222388` as on the site, no extra "Deutschland" or website line); the site Impressum now says "gemäß § 27a UStG" like the ad (DE and EN, deployed 2026-10-27). The site has two more sections (GbR, liability) than the ad block. **Owner to confirm the phone number is the one for public display** | S | ad doc section 4 and section 5, point 7 |
| 80 | P1 | content | ✅ **Implementation disclaimer and quote wizard aligned with the packages**: FAQ, price drivers and deliverables on `/leistungen/ki-sichtbarkeit/` now say that implementation needs site access and a workable technology, otherwise the owner may withdraw from that part (analysis and action list stay, price reduced by the implementation share named in the quote). Quote step 2 asks whether a site exists, what it is built on (free text), access, or the desired platform incl. "Other" (free text); step 3 shows the three packages when "AI visibility & SEO" is chosen. blocks identical — **Status:** Deployed 2026-10-27; the quote page also preselects the need when coming from a service page (sessionStorage), and Back/Send are aligned on the last step. **Owner/lawyer to confirm:** the exact price reduction and the withdrawal wording. | S | request 2026-10-27 |
| 81 | P1 | content | ◐ **AI visibility questionnaire (option 1, decided 2026-10-29)**: the quote wizard collects no question set; the studio sends a short questionnaire (brand and services, region, pages, customer questions, competitors, language) together with the written quote, writes the question set and has it approved before the first run. | quote auto-reply and the process step announce it; the template is in `docs/services/ai-visibility-questionnaire.md` — **Status:** Done in code 2026-10-29 (built locally, not deployed): process step 2 on `/leistungen/ki-sichtbarkeit/` (DE/EN), extra sentence in the quote auto-reply when the need is AI visibility (`api/quote.php`, new `$extra` parameter of `auto_reply`), template and note in `ai-visibility.md` 2.3. **Open:** deploy; send the questionnaire by hand with each quote; optional web form later | S | request 2026-10-29 |

## 7. Deployment and operations (P2 to P3)

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 38 | P2 | code | **`deploy.sh` without rsync on the server**: upload with tar over SSH when `rsync` is missing (netcup) | script works against netcup; README updated | S | deployment discussion |
| 39 | P2 | ops | **Staging site** (`staging.fluxmedia.de`) with password and noindex; run the audits there before releases | staging reachable, `deploy/staging.htaccess.example` in use | M | README, audit report |
| 40 | P3 | code | **CI deploy** (GitHub Actions, option A in `deploy/README.md`) | push to `master` deploys after lint and `build:prod` | M | deploy README |
| 41 | P3 | ops | Search Console: **submit the sitemap**, check indexing, the 404 report and the AI-crawler access | sitemap accepted, no coverage errors | S | plan |
| 42 | P3 | code | **Legacy URL redirects**: the old site was a single page plus `downloads/` demos; look at the old indexed URLs (Search Console, server logs) and map what still gets traffic | only `index.html` is mapped today; extend `public/.htaccess` | S | README open items |
| 43 | P3 | ops | Backups: mailbox and repository; know how to restore | restore tested once | M | legal-audit section 8 |
| 44 | P3 | ops | Two-factor authentication on netcup, mailbox, GitHub, registrar; repository private; read-only deploy key | checked off | S | legal-audit section 8 |
| 45 | P3 | code | **Rewrite the troubleshooting row** that blames the `shared/config.php` symlink (it applies only to the release-folder route) | table covers both routes | S | deploy README |
| 50 | P2 | ops | **Re-check `open_basedir` after every PHP version change** in the netcup panel (it was reset to the document root by the switch to PHP 8.4 and broke `/api/*.php`) | `curl https://www.fluxmedia.de/api/challenge.php` returns JSON after each upgrade | S | 2026-10-21 incident, deploy README |

## 8. Documentation and tooling (P3)

| # | Pri | Type | Task | Done when | Effort |
|---|---|---|---|---|---|
| 46 | P3 | code | **Regenerate `docs/content-de-en.md`** (it predates the services, prices, privacy and accessibility changes) and move your review notes into a separate file so a regeneration cannot overwrite them | `npm run docs:content` (new script) rebuilds the overview from the JSON; notes in `docs/notes.md` | S |
| 47 | P3 | decision | **Squash the generated images** out of the Git history (`0229353` contains images that are now ignored) | history rewritten and force-pushed, or consciously left as it is | S |
| 48 | P3 | code | Update `docs/audits/` with a **new dated audit report** after items 14 to 16 | file `docs/audits/YYYY-MM-DD-lighthouse-axe.md` | S |
| 49 | P3 | content | Update `docs/services-deliverables.md` and `docs/legal-audit.md` after each decision in section 6 | documents match the site | S |

## 9. Suggested order

1. **This week, server side:** items 1, 2, 3, 6, 7, 8 (all small, no code).
2. **Trust and legal:** items 5, 4, 9, 34.
3. **Quality pass:** items 10, 11, 12, then 13; at the same time 14 to 16.
4. **Hardening and tooling:** items 18, 21, 38, 46.
5. **Content growth:** items 24 to 27, then 30 (Ratgeber), then staging (39) and CI (40).
6. **Everything else** as time allows.

## 10. Already done (for reference)

Self-hosted Inter font, responsive images, security headers and CSP, free-analysis protection (proof of work, email
confirmation, per-domain limit, weekly cap), privacy policy rewrite with retention clean-up, accessibility statement with
the real status, legal-page draft notes removed, custom web development service, "from" prices in the JSON, technical
sections on all service pages, business data in a git-ignored config file, `build:prod`, deployment guides (release
folders, git, git pull plus FTP), deployment on netcup, SMTP host corrected, `open_basedir` and storage folder set up and the `.htaccess` hardened for `api/config*` and editor backups (2026-10-21).
