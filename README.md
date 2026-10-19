# fluxmedia-site

The new fluxmedia.de: a **Next.js 16 static export** (`output: 'export'`, HTML generated at build time) plus
**PHP 8 form endpoints** (`/api`) for netcup shared hosting. German at `/`, English at `/en/`.

- Plan: `fluxmedia/docs/strategy/fluxmedia-stage-1-development.md` (§3–§5; the technical requirements in §5 win over
  the legacy code). The legacy Pug site stays in `/Users/bob/Sites/fluxmedia` and is not part of this repository.
- Requirements: Node.js >= 20.9, npm. For testing the forms locally: PHP 8.

## Commands

| Command | What it does |
|---|---|
| `npm install` | install dependencies |
| `npm run dev` | local dev server on :3000 (no PHP, so the forms do not work; see "Testing the forms") |
| `npm run build` | `prebuild` generates AVIF/WebP images, then writes the site to `out/` |
| `npm run lint` | type check (`tsc --noEmit`) |
| `npm run serve` | serve `out/` statically (no PHP, no `.htaccess`) |
| `deploy/deploy.sh` | build, upload a release to netcup, switch `current` (see [deploy/README.md](deploy/README.md)) |

## Project layout

| Path | Contents |
|---|---|
| `src/app/[[...slug]]/` | the single dynamic route; the root layout lives here so `<html lang>` follows the language |
| `src/app/global-not-found.tsx` | becomes `404.html` |
| `src/app/robots.ts`, `sitemap.ts` | `robots.txt` and `sitemap.xml`, generated from the route table |
| `src/i18n/routes.ts` | **route table**: page id → slug per language, service ids, helpers |
| `src/content/de.json`, `en.json` | **all copy**, including service prices (`services.<id>.price`) |
| `config/site.local.json` | **real business data** (legal name, partners, email, phone, address, VAT id); git-ignored. Template: `config/site.example.json` |
| `scripts/site-config.mjs` | validates that file and writes `src/content/site.generated.json` (git-ignored); runs before `dev`, `build` and `lint`. `src/content/site.ts` reads the result |
| `src/components/` | `Header`, `Footer`, `Picture`, `JsonLd`, `forms` (client-side forms), `pages` (all page bodies) |
| `scripts/images.mjs` | pre-generates AVIF/WebP (and 480 px variants for `work/`) into `public/images/generated/` (git-ignored) |
| `public/` | static files copied to `out/`: `.htaccess`, fonts (Inter variable, SIL OFL), images, logos |
| `api/` | PHP endpoints: `analysis.php`, `confirm.php`, `challenge.php`, `contact.php`, `quote.php`, `lib/`, PHPMailer 6.9.1 |
| `deploy/` | `deploy.sh`, `.env.example`, staging `.htaccess` example, deployment guide |
| `docs/` | tracked project documents (never deployed): audits, services and prices, copy overview |

## Working with content

- **Business data** (`[TELEFON]`, address, partners, email, VAT id): `config/site.local.json`. It is not in git, so
  after a fresh clone run `cp config/site.example.json config/site.local.json` and fill it in (without it the build
  uses the example placeholders). These values are not secret: they appear in the public Impressum. They are kept out
  of the repository so they are not published with the code. `vatId` may stay empty (small-business rule); the
  Impressum section "Umsatzsteuer-ID" is then left out. Run `npm run site` to check the file; `--strict` (used by
  `deploy.sh`) fails while a `[PLACEHOLDER]` is left.

- **Change text:** edit `src/content/de.json` and `en.json` together; every key must exist in both. The TypeScript
  type is derived from `de.json`, but `en.json` is cast to it, so a key missing from `en.json` is **not** reported
  by `npm run lint` and shows up as `undefined` on the English page. Check the English pages after adding keys.
- **Change a price:** `services.<id>.price` in both JSON files (for example `"ab 450 €"` / `"from €450"`).
  The VAT note under the price is `ui.vatNote`. How the prices were calculated: `docs/services-deliverables.md`.
- **Add a service:** add the id to `pageIds`, `slugs` and `serviceIds` in `src/i18n/routes.ts`, add the
  `services.<id>` block to both JSON files, and add the id to the breadcrumb list and the home page card lists in
  `src/components/pages.tsx`. The sitemap, footer and services overview pick it up from the route table.
- **Add a page:** add it to `pageIds` and `slugs`, add its content, and render it in `src/app/[[...slug]]/page.tsx`.
- **Images:** put JPEG/PNG originals in `public/images/` (portfolio images in `public/images/work/`, 720×480).
  The build creates the AVIF/WebP versions.
- `docs/content-de-en.md` is a side-by-side overview of the copy. It is generated from the JSON and is not updated
  automatically; edit the JSON, never that file.

## PHP endpoints (`api/`)

Forms post to `/api/*.php` on the same origin. Each endpoint checks the HTTP method and origin, a honeypot field and
a per-IP rate limit (`lib/bootstrap.php`).

The **free analysis** has extra protection (`lib/audit.php`): a proof-of-work challenge solved by the browser,
confirmation of the email address before anything reaches the studio, one analysis per domain per 90 days and a
weekly cap. State is stored as small files in `storage_dir` (pending requests for at most 48 hours, hashed domains,
cap markers).

Configuration: copy `api/config.example.php` to `api/config.php` (git-ignored) or point `FLUX_CONFIG` at a file
outside the webroot. Keys: `allowed_origins`, `to`, `smtp`, `rate_limit`, `storage_dir`, `base_url`, `secret`,
`audit`, and for tests only `mail_dump`. Never commit real credentials.

### Testing the forms locally

`npm run dev` has no PHP. To run the real endpoints, serve the build together with `api/` through PHP's built-in
server and write the mails to files:

```bash
npm run build
rm -rf /tmp/flux-local && mkdir /tmp/flux-local
rsync -a out/ /tmp/flux-local/ && rsync -a api/ /tmp/flux-local/api/
cat > /tmp/flux-config.php <<'PHP'
<?php return [
  'allowed_origins' => ['http://127.0.0.1:8080'], 'to' => 'studio@example.test',
  'base_url' => 'http://127.0.0.1:8080', 'secret' => 'local-test',
  'storage_dir' => '/tmp/flux-storage', 'mail_dump' => '/tmp/flux-mails',
  'smtp' => ['host' => 'x', 'port' => 465, 'encryption' => 'ssl', 'username' => 'u', 'password' => 'p',
             'from_email' => 'support@example.test', 'from_name' => 'Fluxmedia'],
];
PHP
FLUX_CONFIG=/tmp/flux-config.php php -S 127.0.0.1:8080 -t /tmp/flux-local
```

Open http://127.0.0.1:8080, submit the free analysis and read the confirmation link from `/tmp/flux-mails/*.eml`.
The built-in server ignores `.htaccess`, so redirects, headers and caching are only testable on a real Apache.

## Quality checks

The targets come from plan §5: Lighthouse mobile performance, accessibility, best practices and SEO, axe with no
violations, LCP under 2 s, JavaScript under 150 KB gzipped, WCAG 2.2 AA, no third-party requests, no cookie banner.
Audit reports are kept in `docs/audits/` (one dated file per run). Before a release: `npm run lint`,
`npm run build`, a Lighthouse and axe run over the main pages, and a manual keyboard and screen-reader pass.

## Deployment

Simple route: build locally (`npm run build`), upload the contents of `out/` by FTP, and `git pull` on the server
for the PHP endpoints. Optional upgrade: `deploy/deploy.sh` builds, uploads to a timestamped release folder and
switches the `current` symlink, with rollback. Both are described, with checklists and troubleshooting, in
**[deploy/README.md](deploy/README.md)**.

## Open items before launch

- Fill in the placeholders in `config/site.local.json` (phone, street, zip; `deploy.sh` refuses to deploy while any `[...]` is left) and review the legal pages (drafts).
- Rotate the old SMTP password; create `shared/config.php` with `secret` and `storage_dir` on the server.
- Write the Ratgeber (guide) articles; extend the legacy-URL redirect map in `public/.htaccess` (only `index.html` is
  mapped so far).
- Re-run the audit on the staging server and finish the manual accessibility pass.
