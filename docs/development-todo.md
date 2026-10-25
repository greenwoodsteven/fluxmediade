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

Applies only if option D (`legal-audit.md` 9a) is chosen. Texts: `docs/impressum-option-d.md` and `docs/widerruf-datenschutz-option-d.md`.
**Do not change the live pages before the decisions (52 to 56) are made.** Items 57 to 67 then change everything together.

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 52 | P1 | legal | **Insurance check**: add the "IT-Haftpflicht Bedingungen exali 2026-03" to `docs/insurance/`; read territorial scope, exclusions (AI work, promised rankings), retroactive cover; send the question list to exali and get the answers in writing | scope and activity list confirmed in writing | S | legal-audit 9a, policy EX.MPI.52981 |
| 53 | P1 | legal | **Steuerberater**: freiberuflich or gewerblich for web, SEO and AI work; "Fluxmedia" as business designation in the Gewerbeanmeldung; combined turnover for § 19 UStG and the 30,000 € insurance band; free use of the GbR brand and domain (Nutzungsentnahme, Abfärbung) | written answer | S | legal-audit 9a |
| 54 | P1 | decision | **Co-partner**: written agreement to option D, to the new Impressum, to being named on the GbR contact page, and to the GbR staying available for freiberufliche orders | written consent | S | impressum-option-d section 3 |
| 55 | P1 | decision | **Businesses only or consumers too**: businesses only avoids the Widerrufsbelehrung and the Widerrufsbutton (§ 356a BGB); consumers need both | decision recorded | S | widerruf-datenschutz-option-d section 1 |
| 56 | P1 | decision | **Publish the insurance line** in the Impressum or only in quote/AGB (§ 2 DL-InfoV) | decision recorded | S | impressum-option-d 2a |
| 57 | P1 | content | **Fill the placeholders** from the Gewerbeanmeldung: full name, address, phone, USt-IdNr. (if any), territorial scope | no `[...]` left in the texts | S | impressum-option-d section 1 |
| 58 | P1 | code | **Impressum DE/EN** in `de.json`/`en.json` and `config/site.local.json` (operator, Inhaber, insurance, Streitbeilegung, GbR block); remove the partner list and the old OS-platform text | page shows the new text | M | impressum-option-d section 2 |
| 59 | P1 | code | **GbR contact page** (`/kontakt-gbr/`) with its own § 5 data, linked from the Impressum and the footer; no use of the owner's quote form or mailbox | page live, no insurance line on it | M | impressum-option-d section 3 |
| 60 | P1 | code | **Privacy page**: controller changes to the owner, GbR named as controller only for its contact page; netcup processor contract stays | page names the right controllers | S | legal-audit 9a |
| 61 | P1 | code | **Widerruf**: if consumers are accepted, add the page with Widerrufsbelehrung and Muster-Widerrufsformular, a footer link and the **Widerrufsbutton**; if businesses only, add the B2B sentence to the quote page and AGB | matches decision 55 | M | widerruf-datenschutz-option-d sections 2 and 3 |
| 62 | P1 | code | **Quote and confirmation mails**: operator in the footer of the auto-reply (`api/lib/bootstrap.php`), contracting party named in the quote before the contract | mails name the owner | S | impressum-option-d section 6 |
| 63 | P1 | content | **JSON-LD and site config**: `legalName`, organisation node, `partners`, `vatId`, address | structured data matches the Impressum | S | impressum-option-d section 6 |
| 64 | P2 | content | **Invoice and AGB templates**: owner's full name and address, tax number, § 19 UStG note, price wording net/gross | template ready | M | impressum-option-d section 4 |
| 65 | P2 | content | **Accessibility statement**: contact and responsible body | statement matches | S | impressum-option-d section 6 |
| 66 | P2 | ops | **Kleinanzeigen and other profiles**: Impressum, Widerruf and Datenschutz blocks, commercial marking, price wording, no guarantee claims; same for Google Business Profile, LinkedIn, directories | profiles match the Impressum | S | widerruf-datenschutz-option-d section 5 |
| 67 | P2 | ops | **Deploy and verify**: `./deploy/upload.sh`, `git pull` and the server `api/config.php` (`'to'`) if the mail address changes; check the Impressum, privacy and Widerruf pages live, run the axe/Lighthouse check | pages live and checked | S | deploy/README.md |
| 68 | P2 | legal | **Lawyer check** of the final texts, especially § 356 Abs. 4 versus Abs. 6 BGB, the Widerrufsbutton, and whether the Vermögensschaden-Haftpflicht counts as Berufshaftpflicht under § 2 DL-InfoV | written feedback | M | widerruf-datenschutz-option-d section 3 |
| 69 | P3 | ops | **Insurance upkeep**: update the Impressum line when the policy changes or ends (01.10.2027); annual Jahresmeldung; report turnover above 30,000 € | calendar reminder set | S | impressum-option-d 2a |

## 2. Accessibility (P1 to P2)

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 10 | P1 | code | **Manual accessibility pass**: keyboard only, screen reader (NVDA or VoiceOver), 200 % zoom, reduced motion, WAVE | findings listed in `docs/audits/` and fixed | L | audit report, accessibility statement |
| 11 | P1 | code | Test all **form states**: error, success, sending, server error, the quote wizard steps, the confirmation mail flow | each state checked with keyboard and screen reader | M | audit report |
| 12 | P2 | code | **Hero text contrast** (axe "incomplete"): measure the real contrast over the image, adjust the overlay if under 4.5:1 | measured ratio noted in the audit, axe incomplete cleared or explained | S | audit report |
| 13 | P2 | content | **Update the accessibility statement** after items 10 to 12 (date, result, remaining gaps) | `pages.a11yStatement` updated in DE and EN | S | legal-audit section 10 |

## 3. Performance (P2)

| # | Pri | Type | Task | Done when | Effort | Source |
|---|---|---|---|---|---|---|
| 14 | P2 | code | **LCP under 2.0 s on mobile** on all pages (now 2.0 to 2.8 s; `/referenzen/` is the slowest at 2.8 s, the home page 2.4 s) | Lighthouse mobile shows LCP below 2.0 s on the 13 audited pages | M | audit report (target in plan §5) |
| 15 | P2 | code | Reduce the **hero image** weight or priority (`fetchpriority`, size, preload), check that Inter swap did not delay the LCP text | LCP element identified per page and the cause fixed | M | audit report |
| 16 | P2 | code | **`/referenzen/`**: fewer or lazier images below the fold, correct sizes | page weight under 250 KB, LCP under 2.0 s | S | audit report |
| 17 | P3 | code | Keep **JavaScript under 150 KB gzip** (about 141 KB now; the proof-of-work and form changes added to it) | measured after each feature | S | plan §5 |

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
