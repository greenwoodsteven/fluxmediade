# fluxmedia-site

Next.js 16.4.1 static export (`output: 'export'`) + PHP 8 endpoints (`/api`) for netcup shared hosting.
Plan: `fluxmedia/docs/strategy/fluxmedia-stage-1-development.md` (§3–§5). Legacy Pug site stays in `/Users/bob/Sites/fluxmedia`.

- `npm run dev` – local dev (no PHP; forms need `php -S` or the real host)
- `npm run build` – generates AVIF/WebP, writes the site to `out/`
- `src/i18n/routes.ts` – single route table (DE at `/`, EN at `/en/`); `src/content/{de,en}.json` – all copy
- `src/content/site.ts` / `prices.ts` – business data and price placeholders
- `api/` – PHP form endpoints (PHPMailer); copy `config.example.php` to `config.php` (git-ignored)
- `docs/` – tracked project docs (audits in `docs/audits/`, one dated file per run); never deployed
- `public/.htaccess` – redirects, headers, caching; `deploy/` – rsync + symlink release script
