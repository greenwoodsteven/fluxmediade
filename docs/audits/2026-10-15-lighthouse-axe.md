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
