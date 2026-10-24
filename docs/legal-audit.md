# Legal and compliance audit of the current stack

Status: **2026-10-19**, commit `fe13f15`, site live at https://www.fluxmedia.de (Germany, GbR, small-business rule).

**This is a technical review, not legal advice.** It lists what the site actually does, compares that with what the
legal pages say, and names what should be checked by a lawyer, the data-protection officer or the Steuerberater.
Statements about law reflect general knowledge of German and EU rules and may have changed; confirm before relying on
them. "Check" means *someone qualified should look at it*, not that something is known to be wrong.

## 1. Summary of findings

| # | Priority | Finding | Who checks |
|---|---|---|---|
| 1 | ~~Fix now~~ **Done 2026-10-19** (built, deploy by uploading `out/`) | The accessibility statement said the audits would be completed "before launch". It now states the real status: automated tests passed, manual pass outstanding. Update it again when the manual pass is done | you |
| 2 | **Check (low to medium risk, reviewed 2026-10-19; contractor of Krieger Digital for 10+ years)** | Portfolio names clients and shows small screenshots (Höffner, Möbel-Kraft, pdf-to-fax and others). Naming real customers is usually tolerated unless they object or the contract forbids it, but it is not a statutory right; the screenshots add third-party rights (logos, photos, people). See section 6a | you, lawyer |
| 3 | ~~Fix soon~~ **Implemented 2026-10-19**, review still open | Privacy policy rewritten with the standard structure (section 4). Still to confirm: the processor agreement with netcup, the log retention at netcup, the daily cron job, and a legal review of the text | you, lawyer / DPO |
| 4 | **Fix soon** | Impressum: check completeness (§ 18 MStV, dispute resolution, VAT ID vs small-business rule) | lawyer, Steuerberater |
| 5 | Check | `hero.jpg` and the other site images: source and licence not recorded | you |
| 6 | Check | Marketing claims on the site must be provable (UWG): "Über 10 Jahre Erfahrung", "Server in Deutschland", "DSGVO-bewusst", "Festpreis", prices | you |
| 7 | Check | Consumers or only businesses? If consumers: price display, withdrawal right, terms | lawyer |
| 8 | Check | Follow-up emails after the free analysis need a legal basis (UWG § 7) | you |
| 9 | Check | Records and processors: processing register, processor agreement with netcup, security measures document | you |
| 10 | Check | Old SMTP password rotated? config permissions, storage outside the webroot, 2FA on mail, GitHub, netcup | you |
| 11 | Decide | AI crawlers are explicitly allowed in `robots.txt`; decide whether to keep or add a copyright reservation | you |
| 12 | Later | AI chatbot offer (EU AI Act transparency), Stripe/PayPal, voicemail line, LinkedIn link: each needs a privacy-text update when it goes live | you |

Note: the Exili insurance is recorded under owner‘s name. Type is Einzelunternehmer.
If there was a claim against Fluxmedia this may mean no cover. Exili states that this could change at any time. Consider changing Fluxmedia.de to owner‘s Freiberufler tax number and name only and then if Exili requires change to cover Einzelunternehmer & Freiberufler under same owner’s name. Alternative could Einzelunternehmer tax number ust be used instead of Feiberufler tax number. Concern is verbärbung von Fluxmedia gbr. See md that relates to Fluxmedia close strategy. Owner is now over 55

## 2. Data-flow inventory (what the site really does)

| Component | What happens | Personal data | Third party | Notes |
|---|---|---|---|---|
| Hosting (netcup web hosting) | serves static files and runs PHP | visitor IP and request data in server logs | netcup GmbH (processor) | processor agreement, log retention and location to confirm in the customer panel |
| Static pages (Next.js export) | HTML/JS/CSS/images from the same host | none beyond logs | none | no analytics, no tracking, no cookies, no `localStorage`/`sessionStorage` in the code (checked with a code search) |
| Fonts | Inter variable, self-hosted, SIL OFL | none | none | licence text shipped as `fonts/OFL-Inter.txt`; legacy Univers fonts removed |
| Contact and quote forms | POST to `api/contact.php`, `quote.php`; mail via SMTP | name, email, message, project details | netcup mail server | rate limit stores a salted hash of the IP for about one hour |
| Free analysis | proof-of-work, then pending file, confirmation mail, then notification to the studio | name, email, website, search terms, optional business details | netcup mail server | pending request stored on the server for at most 48 h; domain stored only as a hash for 90 days; weekly-cap marker files without personal data |
| Confirmation page | `api/confirm.php` | the token in the link | none | `Referrer-Policy: no-referrer`, `noindex` |
| Email (mailbox at netcup) | receives requests, sends auto-replies | all request contents | netcup | retention is whatever you do in the mailbox; the privacy text says "deleted after processing" |
| Source repository (GitHub) | code and docs | none intended | GitHub (US company) | visibility (private/public) to confirm; history contains the partners' names and the email address, which are public in the Impressum anyway; no secrets (see section 8) |
| Deployment | FTP/SFTP, SSH, `git pull` | none | netcup | FTP is unencrypted unless SFTP/FTPS is used |

Not used (and therefore no obligations from them): Google Fonts, Google Analytics, reCAPTCHA, Cloudflare Turnstile,
embedded maps or videos, social-media plugins, chat widgets, newsletter tools, cookies.

## 3. Impressum (§ 5 DDG)

What the page shows: company name (Fluxmedia GbR), address, partners, phone, email, VAT ID, liability notice.

Check:
- **Partners (Gesellschafter) and authorised representatives:** for a GbR, the names of the partners are required;
  confirm the list is complete and spelled as in the partnership agreement.
- **Address:** must be a postal address where you can be served, not a P.O. box.
- **Two ways of contact:** email plus phone is the usual way to satisfy "quick and direct" contact.
- **VAT ID vs small-business rule (§ 19 UStG):** the site shows a VAT ID *and* the note that no VAT is shown. That is
  not necessarily contradictory (a VAT ID can be held by small businesses), but the Steuerberater should confirm
  the combination and the wording on invoices.
- **Responsible for content (§ 18 Abs. 2 MStV):** needed if the site publishes editorial content that goes beyond
  pure company information. The planned Ratgeber articles probably do. Add a line with name and address when they go live.
- **Dispute resolution (§ 36 VSBG):** a short statement on whether you take part in consumer arbitration is common
  for sites that address consumers. The EU online dispute platform link is no longer required (the platform was
  discontinued); remove old wording if you copy a template.
- **English page:** a courtesy translation with "the German version is authoritative" is shown; keep it.

## 4. Privacy policy (Datenschutzerklärung)

**Implemented 2026-10-19** (German and English, 12 sections): controller, overview, hosting and server logs, contact/quote forms and email, free analysis, abuse protection, recipients and third countries, external links, encryption, automated decisions, rights incl. supervisory authority and how to exercise them, date. What the text promises, and what has to be true for it:
- netcup processor agreement is concluded (customer panel).
- netcup deletes server logs "after a short time": check the actual retention and name it if it is long.
- A daily cron job runs `api/cleanup.php` (deploy README, One time, step 7); without it the 48-hour and one-day deletions only happen while forms are being used.
- The authority named is the Baden-Württemberg commissioner; confirm it is the right one for the registered seat.
- The statement that analysis addresses are not used for advertising without separate consent is a commitment you must keep.

The list below is the original gap analysis, kept for the review.

The current text covers: controller, hosting, no cookies or third-party content, forms, rights.

Compared with what the site does, check and probably add:
1. **Supervisory authority:** name the competent one (for a business in Überlingen this would be the state data-protection
   commissioner of Baden-Württemberg; confirm).
2. **Legal bases per processing:** server logs (legitimate interest, Art. 6(1)(f)), contact and analysis requests
   (Art. 6(1)(b) pre-contractual measures and/or consent Art. 6(1)(a)), abuse protection (legitimate interest).
3. **Server logs:** what is logged, by whom (netcup), and for how long. The sentence "Ein Auftragsverarbeitungsvertrag
   besteht" must be **true**: check that the processor agreement with netcup is concluded in the customer panel.
4. **Recipients and processors:** netcup (hosting, mail). No transfer to third countries is intended; the text should
   say so only if it is correct.
5. **Retention periods, stated concretely:** pending analysis requests 48 hours; hashed domain 90 days; IP hash about
   one hour; mailbox contents as per your own deletion rule (name it, for example "after completion, at the latest
   after the statutory retention period").
6. **Free analysis flow:** the text already mentions storing details until the email is confirmed and the domain
   hash; check that the wording matches the final behaviour (it does as of this commit).
7. **Consent:** how to withdraw it and that withdrawal does not affect earlier processing.
8. **Rights:** access, rectification, erasure, restriction, portability, objection, complaint (already listed);
   add *how* to exercise them (the email address) and the response time (one month).
9. **Technical note for erasure requests:** pending files are named by a hash of the confirmation token, not by the
   email address, so they cannot be searched by address. They expire after 48 hours anyway.
10. **Planned features:** voicemail phone number (provider and recordings), LinkedIn link (a plain link, no embed:
    mention it as an external link), Stripe or PayPal for shop projects, an analytics tool if ever added.

## 5. Cookies and device access (TDDDG § 25)

- The only cookie is `fm_lang` (`de`/`en`, one year), set by the language switcher (`src/components/LangLink.tsx`) after an
  explicit click. It is strictly necessary under TDDDG § 25(2) no. 2, so no banner; it is disclosed in the privacy page
  ("Sprachauswahl"). First-visit detection (Accept-Language, `public/.htaccess`) stores nothing. No other cookies or browser storage.
- The page makes requests only to the same host (CSP: `default-src 'self'`, `connect-src 'self'`).
- **To confirm once in a browser:** open the live site with developer tools, check *Application → Cookies* holds at most `fm_lang` (only after using the switcher) and *Local
  storage* is empty and the *Network* tab shows only `www.fluxmedia.de`. If both are true, no consent banner is needed.
- Re-check after every change that adds a script, an embed or a tool.

## 6. Content, licences and rights

| Item | Question |
|---|---|
| Portfolio screenshots and names (Höffner, Möbel-Kraft, pdf-to-fax, Bruno, Emotion, Yoga-Kreis) | Naming real customers is usually tolerated unless they object or the contract forbids it; it is not a statutory right. Screenshots contain third-party logos, photos (also of people) and current offers. Details and mitigations: section 6a. |
| `public/images/hero.jpg` and `hero-768.jpg` | Where does the photo come from, and does the licence allow commercial use without attribution? It was copied from the legacy project, so the origin is not recorded. |
| `logo_black.svg`, `logo_white.svg` | Your own logo: no issue, if you created it or hold the rights. |
| Inter font | SIL OFL: free to self-host and use commercially; the licence note is in `public/fonts/OFL-Inter.txt`. |
| Legacy fonts (Univers) | Removed from the site and the deployment; no further action unless they are still on the server (delete old copies). |
| PHPMailer (LGPL 2.1) | Licence file is part of `api/PHPMailer`; keep it when updating. |
| Next.js, React, Tailwind (MIT) | Usually no visible notice is required for the compiled site; if you want to be thorough, publish a short third-party notices page. |
| Texts | Written for this site; if text was taken from the legacy site or from another source, confirm you may reuse it. |
| Links to client sites | Normal outbound links are fine; the liability disclaimer in the Impressum covers them. |

### 6a. Portfolio references in detail (reviewed 2026-10-19)

**Facts given by the owner (2026-10-19):** Fluxmedia worked for more than ten years as a **contractor for Krieger Digital**, which
develops the web products of Höffner, Möbel-Kraft and others. The same screenshots were shown on the previous
fluxmedia.de for more than ten years without complaint. Consequences:
- The contract partner is **Krieger Digital**, not Höffner or Möbel-Kraft. Permission, confidentiality and
  reference clauses are therefore a question for Krieger Digital (and its contract with Fluxmedia). Ask there first.
- "Onlineshop für Höffner" is true as to the shop but leaves out that the work was done through Krieger Digital.
  Safer wording: "Webentwicklung im Auftrag von Krieger Digital für Höffner" (or "... Möbel-Kraft").
- Ten years without a complaint lowers the practical risk and shows the use was tolerated, but it is **not** a legal
  permission: a rights holder can still object later, and the new site shows newly made screenshots with current
  photos and offers, which is a new publication. Treat it as a sign of low risk, not as clearance.

**The common view that a service provider may name its customers is partly right, but it is not a general right.**
German law has no rule that allows it by default. The question is decided case by case, and the contract matters.

- **Naming the client.** Naming a customer as a reference touches the customer's company and personality right.
  The LG Bielefeld (judgment of 23.11.2021, 15 O 104/20) forbade a consultant to list an insurer and one subsidiary
  as references after the insurer had objected, because the consultant could not prove the work. For another
  subsidiary the reference was **tolerated**, because an invoice proved the collaboration. So: a *true, provable*
  reference is usually acceptable, an unprovable or unwanted one is not, and a client's objection must be taken
  seriously (the case escalated because the name was removed and later put back). Source: a law-firm summary only; read the
  judgment itself or ask a lawyer before relying on it.
- **Contract.** Confidentiality or reference clauses in the contract (or an NDA) override the above. Check each
  client contract, and the contract of the agency or employer if the work was done through one.
- **Truthfulness (UWG).** "Onlineshop für Höffner" claims that **Fluxmedia** did the work. If the work was done
  earlier as an employee, through an agency, or as a subcontractor, say so ("Mitarbeit an ...", "im Auftrag von ...") or
  have it confirmed that the reference may be used that way. The Bielefeld summary notes that it counts who actually
  provided the service, not who arranged it.
- **Screenshots.** A small size does not remove third-party rights: German law has no general "thumbnail is fine" rule.
  What may be visible in a screenshot: the client's **logo** (trademark; factual reference use is often allowed,
  but see above), **photos** (copyright of the photographer or stock agency; the Höffner screenshot shows two
  people, which also raises personality-rights questions for the models), **product images and texts** (copyright of
  the client or its suppliers), and **current promotions** (prices and "40 %" banners that go out of date). If you
  built the site you may hold rights in the code and design, but not in the client's photos.
- **Cheap mitigations.**
  1. Send each client a short email: "we list your site as a reference, please tell us if you object", and keep the
     reply (it is not formal consent, but it documents good faith and gives them a chance to object).
  2. Keep proof of each project (contract, invoice, contact person).
  3. Crop the screenshot to the header with the logo, or replace it with a neutral mockup, so no people or
     time-limited offers appear.
  4. Add a caption "Screenshot, Stand Oktober 2026. Marken und Inhalte gehören den jeweiligen Inhabern."
  5. Agree to remove an entry within a short time when asked, and do it for good.
- **Which entries to look at first:** the three with big brands and photos (Höffner, Möbel-Kraft) and the pdf-to-fax
  entry (your own project: no issue if the site is yours or you have the owner's permission).

## 7. Advertising claims and prices (UWG, PAngV)

Claims on the site that you must be able to prove on request:
- "Über 10 Jahre Erfahrung" / "Over 10 years" (the site says Bodensee; your own notes mention Berlin earlier: align the wording with the facts).
- "Server in Deutschland" / "Gehostet in Deutschland": true for the netcup hosting if the data centre is in Germany;
  the technical sections of the service pages mention AWS and Cloudflare as stack options for client projects, which is
  fine as long as they are not described as part of this site.
- "DSGVO-bewusst": a soft wording; avoid "DSGVO-konform" without a review.
- "Festpreis": the custom-development service is billed hourly; keep the two clearly separate (the page does).
- "Kostenlos" (free analysis): the terms on the form state the limits (one per company and domain, weekly cap, may be declined). Keep them visible.
- No guarantee of rankings or AI citations (the site says so; keep it).
- "Not legal advice" for the BFSG assessment (the site says so; the RDG limits legal services).

Prices:
- Prices are shown without VAT because of the small-business rule; the note under each price says so. Confirm the wording with the Steuerberater and keep invoices consistent (§ 19 note, no VAT line).
- **If you sell to consumers** (private persons): the price display rules (PAngV) apply, prices are final prices, and distance-selling information, the withdrawal right and a terms-and-conditions document become relevant. If the offer is **only for businesses**, say so on the site (for example "Angebote richten sich an Unternehmer") and check that this holds in practice.

## 8. Security (Art. 32 GDPR) and operations

Already in place: HTTPS with HSTS, security headers and a restrictive CSP, same-origin forms, honeypot, rate limit, proof-of-work and email confirmation on the free analysis, `api/lib`, `api/PHPMailer`, `api/storage` and `api/config*.php` blocked, config outside git.

Check:
- [ ] The old SMTP password (from the legacy site) is rotated and the new one is only in `api/config.php`.
- [ ] `api/config.php` has mode 600 and `storage_dir` points outside the webroot.
- [ ] `https://www.fluxmedia.de/api/config.php` and `/api/lib/bootstrap.php` return 403.
- [ ] Two-factor authentication on the netcup account, the mailbox, GitHub and the domain registrar.
- [ ] The GitHub repository is **private**, deploy keys are read-only, and a secret scan of the history is clean
      (for example `gitleaks`). The history is not expected to contain secrets: `config.php` has always been ignored.
- [ ] FTP: use SFTP or FTPS if available; the FTP password is not reused anywhere.
- [ ] SPF, DKIM and DMARC are set for `fluxmedia.de`, so the confirmation emails arrive and cannot be spoofed.
- [ ] Backups: of the mailbox and of the repository; know how to restore.
- [ ] A short procedure for a data breach (who is informed, 72-hour notification to the authority if required).

## 9. Records and agreements

- **Processing register (Art. 30):** even a small business should keep one; the data-flow table in section 2 is a start.
- **Processor agreements (AVV):** netcup (hosting and mail). Keep the confirmation. Add any future processor (Stripe, voicemail provider, n8n or chatbot providers used for clients).
- **Data-protection officer:** normally not required for a business of this size (a DPO is mandatory when at least 20 people are constantly involved in automated processing); confirm.
- **Terms and conditions (AGB):** optional for B2B work, but a short one-page document covering scope, estimates, hourly billing and liability helps; have it reviewed.
- **Client projects:** when you process personal data for a client (chatbot, automation, WordPress support with access to user data) you need an AVV with that client.

## 10. Accessibility (BFSG, WCAG 2.2)

- The BFSG mainly concerns products and services for consumers (for example online shops); micro-enterprises
  providing services are exempt. This site is a company site and is probably not in scope, but it is a showcase for an
  accessibility offer, so quality matters for credibility.
- **Done 2026-10-19:** the statement now has the sections "Stand", "Was geprüft wurde" and "Noch nicht geprüft" (German and English). Update it after the manual pass. The original problem was: the statement page said "Die Prüfung … wird vor dem Start abgeschlossen und hier dokumentiert." The site is live. Replace it with the real status. Facts you can state today: automated checks (Lighthouse accessibility 100 and axe with 0 violations on the audited pages, 15 October 2026); not yet done: manual keyboard and screen-reader pass, form error states and the quote wizard only partly tested, hero text contrast flagged "incomplete" by axe.
- Complete the manual pass (keyboard only, NVDA or VoiceOver, 200 % zoom, reduced motion, WAVE) and then update the statement with the date and the result. Keep the feedback address and the one-working-day reply promise only if you can keep it.

## 11. AI-related points

- **Own site:** no AI features, no chatbot, no AI-generated content labelled as human. Nothing to do.
- **AI crawlers:** `robots.txt` allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended on purpose
  (plan § 5, because the AI-visibility service needs it). Allowing crawling is a business decision; it is not a
  copyright reservation. If you ever want a text-and-data-mining opt-out (§ 44b UrhG), it has to be stated in machine-readable form and would
  contradict the current policy.
- **Chatbot service for clients:** the EU AI Act's transparency duties (telling users they talk to an AI) apply to such
  systems; the service page already promises labelling. Check the current application dates and the details before you sell it, and have the client contract cover roles and data processing.
- **Quality claims:** do not promise "will appear in ChatGPT"; the site already says it cannot be guaranteed.

## 12. Email marketing and follow-up (UWG § 7)

- The confirmation email and the auto-reply are service messages for a request the person made. They contain no advertising.
- Writing to someone *after* the report with offers is advertising. For business contacts a legal basis is needed (for example the consent given in the form or an existing customer relationship under the strict conditions of § 7 Abs. 3 UWG). The form consent text covers "processing the request"; it does **not** cover a newsletter. Do not add form entries to a mailing list.
- Cold outreach by email (for example to the domains you analyse) is generally not allowed without consent.

## 13. Not needed (as far as the current stack goes)

| Topic | Why |
|---|---|
| Cookie banner | no cookies, no storage, no third-party requests (confirm once, section 5) |
| Data-processing notice for Google Fonts, Analytics, maps, videos, reCAPTCHA | none are used |
| Cloudflare Turnstile / reCAPTCHA | replaced by the self-hosted proof-of-work |
| Impressum on the English pages in a different form | one Impressum, English courtesy translation |
| Consent checkbox for "required cookies" | no cookies |

## 14. Suggested order of work

1. Update the accessibility statement and finish the manual accessibility pass (section 10).
2. Review the portfolio entries as described in section 6a: contract clauses, proof of the work, notify the clients, crop the screenshots (section 6).
3. Fill the gaps in the privacy policy (section 4) and have it reviewed; confirm the processor agreement with netcup.
4. Complete the Impressum (section 3) with the Steuerberater and lawyer.
5. Confirm the security checklist (section 8) and the browser check for cookies and requests (section 5).
6. Decide consumers vs businesses and publish the matching wording (section 7).
7. Document the hero image's source and licence (section 6).
8. Before the Ratgeber goes live: § 18 MStV line in the Impressum, and review the article texts for claims.
