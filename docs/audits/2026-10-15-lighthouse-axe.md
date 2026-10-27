# Accessibility & Lighthouse audit

Audited 15 Oct 2026 against the static export (`out/`), targets from plan §5.

## Method
- **Lighthouse** (current npm release), mobile profile with default simulated slow-4G throttling, categories Performance / Accessibility / Best Practices / SEO.
- **axe-core** in headless Chrome at 1280×900, tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`.
- Pages are served by a local gzip static server (not Apache): TTFB and compression only approximate netcup. Re-measure on staging.
- 11 pages: `/`, `/leistungen/`, `/leistungen/ki-sichtbarkeit/`, `/leistungen/website-relaunch/`, `/seo-analyse-kostenlos/`, `/angebot/`, `/referenzen/`, `/kontakt/`, `/impressum/`, `/en/`, `/en/services/ai-visibility/`.

## Results (after fixes)

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | axe violations |
|---|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 | 1.9 s | 0 | 20 ms | 0 |
| `/leistungen/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 0 |
| `/leistungen/ki-sichtbarkeit/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 0 |
| `/leistungen/website-relaunch/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 0 |
| `/seo-analyse-kostenlos/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 0 |
| `/angebot/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 0 |
| `/referenzen/` | 96 | 100 | 100 | 100 | 2.8 s | 0 | 10 ms | 0 |
| `/kontakt/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 0 |
| `/impressum/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 0 |
| `/en/` | 98 | 100 | 100 | 100 | 2.3 s | 0 | 10 ms | 0 |
| `/en/services/ai-visibility/` | 99 | 100 | 100 | 100 | 2.2 s | 0 | 20 ms | 0 |

## Against the §5 targets
| Target | Status |
|---|---|
| Mobile Lighthouse ≥ 95 | Met on all pages (96–100) |
| CLS < 0.05 | Met (0) |
| INP < 200 ms | Not measurable in lab; TBT 10–20 ms suggests no problem. Check field data later |
| LCP < 2.0 s | **Only `/` (DE) meets it in this simulation.** Others 2.2–2.8 s |
| < 150 KB JS on content pages | Met: ≈ 141 KB gzipped (React/Next runtime), excluding the legacy-browser `noModule` polyfill chunk |
| No third-party requests | Met |
| axe clean | 0 violations on all 11 pages |
| Manual keyboard + screen-reader pass (NVDA/VoiceOver) | **Not done** |
| WAVE | **Not done** |

## Fixes made during the audit
- **axe `heading-order`** on `/leistungen/`: service cards rendered `h3` directly after the `h1`; the index now uses `h2`.
- **Fonts:** Univers converted to Latin-subset **woff2** (≈ 20 KB each, down from ≈ 29 KB), unused Light weight removed, both weights preloaded, `font-display: optional` (avoids a late font swap re-painting the LCP text). Trade-off: with a cold cache the fallback font may be shown for that first page view.
- **Images:** hero served as responsive AVIF/WebP (768 px and 1280 px, correct intrinsic size); portfolio images get 480 px variants and a `sizes` hint; the first two images on `/referenzen/` load eagerly.
- **Hero contrast:** the dark overlay was strengthened (image opacity 35 % over `#222`). Worst case, a pure-white pixel, gives a background of about `#6f6f6f`, so white text is ≈ 5.0:1 (AA needs 4.5:1).

## Open items
1. **axe "incomplete": `color-contrast`** on the hero text over the photo. axe cannot compute contrast over an image; the calculation above covers it but it should be checked by eye on real devices.
2. **LCP gap.** Remaining LCP is bounded by render-blocking CSS (≈ 4 KB, ~150 ms simulated) and the framework JS. Options: inline the critical CSS, reduce JS further, or accept (the throttling is pessimistic; re-test on netcup with HTTP/2 and Brotli).
3. **`/referenzen/`** is the slowest (six images, 2.8 s). Consider a smaller first row or fewer images above the fold.
4. Manual accessibility pass: keyboard-only, focus order in the quote steps, form error announcements, NVDA and VoiceOver; WAVE. Then publish the Barrierefreiheitserklärung with the results.
5. Forms and the quote wizard were audited only in their initial state, not in error or success states.
6. Re-run on staging with real headers (HSTS, CSP, caching) before launch.

## Re-running
Tooling is not part of the repo. Build (`npm run build`), serve `out/` with gzip, then run Lighthouse (mobile) and `axe-core` (tags above) over the page list.

---

# Follow-up: manual pass, 27 Oct 2026

Run against a local build (`out/` plus the PHP endpoints with `mail_dump`), in Chrome, with axe-core 4.10.2 (same tags as above). Screen readers (NVDA, VoiceOver) and WAVE were **not** run; everything below is keyboard, DOM and measurement.

## What was checked
- **axe on 18 pages** (DE and EN: home, services, AI visibility, accessibility, analysis, quote, references, about, contact, GbR contact, Impressum, privacy, withdrawal, statement, EN home, quote, privacy, statement): 0 violations after the fixes.
- **Form states**, contact and quote forms: empty submit (focus goes to the first invalid field, `aria-invalid` and `aria-describedby` set, summary in an `aria-live` region), sending, server error (`role="alert"`), success.
- **Quote wizard**: all four steps by keyboard.
- **Reflow** at 640 px (200 % zoom) and 320 px (400 %): horizontal overflow on none of the 18 pages after the fix below.
- **Reduced motion**: `prefers-reduced-motion` stops transitions, the page fade and smooth scrolling; the word cloud starts static.
- **Hero contrast** (item 12): hero image sampled pixel by pixel under every text box, with the real 35 % opacity over `#222`. Worst case 5.00:1 (the image contains pure white, so this is also the theoretical worst case). AA needs 4.5:1. The axe "incomplete" on the hero no longer appears.

## Findings and fixes
| # | Finding | WCAG | Fix |
|---|---|---|---|
| 1 | After a successful send the form unmounts and focus falls to `<body>`; the status was not focused | 2.4.3, 4.1.3 | `forms.tsx`: the confirmation is focused (`tabIndex=-1`) |
| 2 | Quote wizard: on the last step the focused "Next" button disappears, focus is lost; on other steps focus stays on the button, behind the changed content | 2.4.3 | `forms.tsx`: focus moves to the first control of the new step |
| 3 | Submit button was `disabled` while sending (focus drops), and sending was not announced | 2.4.3, 4.1.3 | `aria-disabled` plus a guard in `onSubmit`, a screen-reader-only "Wird gesendet …" in the live region |
| 4 | Rotating word cloud on the home page moves automatically for longer than 5 s with no way to stop it | 2.2.2 (A) | Button "Animation anhalten / starten" (DE and EN); stopping shows the static list; the preference is now followed live |
| 5 | Words at the back of the sphere faded to 25 % opacity: contrast down to 1.6:1 (axe violation, 5 to 6 nodes on `/` and `/en/`) | 1.4.3 | Opacity floor 85 %, worst case 4.8:1 for the muted words |
| 6 | `/datenschutz/` scrolled sideways by 7 px at 320 px (the word "Datenschutzerklärung" in the h1) | 1.4.10 | `overflow-wrap` and `hyphens: auto` on headings |

## Still open
- **NVDA and VoiceOver**, and **WAVE**: not run. The markup is correct (names, descriptions, live regions), but how it is read out has not been heard.
- In the word cloud, overlapping words make axe report `color-contrast` as "incomplete" (cannot evaluate). The words are also available as a plain list, and the movement can be paused.
- Confirm on real devices and on the live site once deployed.
