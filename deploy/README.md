# Deployment (netcup shared hosting)

The site is built on your machine (`out/` = static files) and uploaded together with `api/` (PHP) into a new release
folder. The domain's document root points at a `current` symlink, so a release goes live atomically and can be rolled
back in seconds.

```
$DEPLOY_PATH/
├── releases/
│   ├── 20261019-101500/      <- out/ + api/ of one deploy
│   └── 20261020-093000/
├── shared/
│   ├── config.php            <- real credentials, NOT in git, outside every release
│   └── storage/              <- state of the free analysis (mode 700)
└── current -> releases/20261020-093000
```

## 1. One-time setup

On your machine
1. `cp deploy/.env.example deploy/.env` and set `DEPLOY_HOST=user@host` (SSH login) and `DEPLOY_PATH=/path/to/site`.
   `deploy/.env` is git-ignored.
2. Make sure `ssh $DEPLOY_HOST` works with a key (no password prompt) and that `rsync` exists on both sides.

On the server (netcup customer control panel and SSH)
1. Create the folders: `mkdir -p $DEPLOY_PATH/releases $DEPLOY_PATH/shared/storage && chmod 700 $DEPLOY_PATH/shared/storage`.
2. Create `$DEPLOY_PATH/shared/config.php` from `api/config.example.php` and `chmod 600` it:
   - `smtp`: the real mailbox login. **Rotate the old SMTP password first**; it was in the legacy site.
   - `to`: where requests are delivered. `allowed_origins`: `https://www.fluxmedia.de` and `https://fluxmedia.de`.
   - `base_url`: `https://www.fluxmedia.de` (used in the confirmation link of the free analysis).
   - `secret`: a long random string (`openssl rand -hex 32`); it signs the proof-of-work challenges.
   - `storage_dir`: `$DEPLOY_PATH/shared/storage` (absolute path). Inside a release folder every deploy would reset
     the domain history and the weekly cap.
   - `audit`: `weekly_cap` (default 10), `domain_days` (90), `pending_hours` (48).
3. Point the domain's **document root** at `$DEPLOY_PATH/current` (customer control panel, domain settings) and
   choose PHP 8.x for the domain.
4. Enable the free TLS certificate for `fluxmedia.de` and `www.fluxmedia.de`.
5. Symlinks must be allowed (`FollowSymLinks` or `SymLinksIfOwnerMatch`). If the plan does not allow them, see
   "Without symlinks" below.

## 2. Before every deploy (checklist)

- [ ] `git status` is clean and you are on the commit you want to publish.
- [ ] `npm run lint` passes.
- [ ] `config/site.local.json` exists on the machine you deploy from and has no `[...]` placeholders left (the script
      checks this and stops otherwise; it is not in git, copy it from the template or another machine).
- [ ] Prices and copy reviewed in both languages (`src/content/{de,en}.json`).
- [ ] After bigger changes: Lighthouse and axe run on the main pages (`docs/audits/`).
- [ ] If `api/config.example.php` gained new keys, `shared/config.php` on the server has them too.

## 3. Deploy

```bash
deploy/deploy.sh
```

The script:
1. checks `config/site.local.json` (`node scripts/site-config.mjs --strict`), then runs `npm run build` (generates the AVIF/WebP images, then `out/`);
2. rsyncs `out/` to `releases/<timestamp>/` (including `.htaccess` from `public/`);
3. rsyncs `api/` to `releases/<timestamp>/api/` without `config*.php`;
4. links `releases/<timestamp>/api/config.php` to `shared/config.php`;
5. switches `current` to the new release;
6. deletes all but the newest five releases.

`NEXT_PUBLIC_SITE_URL` controls the absolute URLs in canonical links, hreflang, sitemap and structured data (default
`https://www.fluxmedia.de`). Set it only for a staging build.

## 4. After the deploy (smoke test)

```bash
curl -sI https://www.fluxmedia.de/ | head -20          # 200, security headers, Cache-Control: max-age=0
curl -sI http://fluxmedia.de/ | grep -i location       # 301 to https://www.fluxmedia.de/
curl -sI https://www.fluxmedia.de/api/lib/bootstrap.php | head -1     # 403
curl -sI https://www.fluxmedia.de/api/config.php | head -1            # 403
curl -s https://www.fluxmedia.de/api/challenge.php                    # {"ok":true,"salt":...}
curl -sI https://www.fluxmedia.de/does-not-exist/ | head -1           # 404
```

Then in a browser:
- open `/`, `/leistungen/`, `/en/` and check the language switch;
- send the free analysis form with your own email address, check that the confirmation mail arrives, click the link,
  press the confirm button and check that the notification arrives at the studio address;
- send the contact form and the quote form;
- `/sitemap.xml` and `/robots.txt` load;
- the browser console shows no CSP errors and the network tab shows requests to fluxmedia.de only.

Free-analysis test data stays in `shared/storage`. To reset the domain history after testing, delete the files in
`shared/storage/domains/` and `shared/storage/confirmed/`.

## 5. Rollback

```bash
deploy/deploy.sh rollback
```

This points `current` at the **second newest** release folder (by name). It does not remove anything, so deploy again
to go forward. Calling it twice in a row leaves you on the same release. To pick a specific release:

```bash
ssh $DEPLOY_HOST "ln -sfn releases/<timestamp> $DEPLOY_PATH/current"
```

`shared/config.php` and `shared/storage` are not part of a release and are not rolled back.

## 6. Caching

HTML, `.txt` and `.xml` are served with `max-age=0, must-revalidate`; `/_next/static/*` is hashed and immutable;
fonts and images are cached for 30 days (their names are not hashed). A deploy needs no cache purge. If you replace an
image under the same name, visitors can see the old one for up to 30 days, so give changed images a new name.

## Staging (`staging.fluxmedia.de`)

`public/.htaccess` redirects every host to `https://www.fluxmedia.de`, so a staging copy must not use it unchanged.

1. Create the subdomain with its own document root and `shared/config.php` (own `storage_dir`; `allowed_origins`
   and `base_url` set to the staging host; ideally a different `to` address).
2. Build with `NEXT_PUBLIC_SITE_URL=https://staging.fluxmedia.de npm run build`.
3. Upload `out/` and `api/` as in the script (manually, or with a copy of it pointed at the staging path) and replace
   `.htaccess` in the release with `deploy/staging.htaccess.example` (password with an `.htpasswd` outside the
   webroot, plus `X-Robots-Tag: noindex, nofollow`). Keep the `.htaccess` rules that block `api/lib`, `api/PHPMailer`
   and `api/storage`.
4. Run the audit and the manual checks here before the production deploy.

## Without symlinks

If the plan does not allow symlinks, rsync straight into the webroot instead:

```bash
npm run build
rsync -az --delete --exclude 'api/' out/ user@host:/path/to/webroot/
rsync -az --exclude 'config.php' --exclude 'config.local.php' --exclude 'config.example.php' api/ user@host:/path/to/webroot/api/
```

`--delete` on the first command removes old files from `out/`'s area but leaves `api/` alone (it is excluded), and the
second command has no `--delete`, so `api/config.php` survives. Keep `config.php` untracked in `webroot/api/` and set
`storage_dir` to a folder **outside** the webroot, because the default `api/storage` is inside it. You lose atomic
switching and one-command rollback: a half-finished upload is visible to visitors, so deploy outside busy hours.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| 500 from `/api/*.php`, `{"error":"config"}` | `api/config.php` missing: the symlink to `shared/config.php` was not created or the file does not exist |
| Form says sending failed, `{"error":"mail"}` | wrong SMTP login or port in `config.php`; check the PHP error log |
| `{"error":"origin"}` (403) | the site host is not in `allowed_origins` |
| `{"error":"pow"}` (400) | the challenge expired, was reused, or `secret` differs between requests; the browser needs `crypto.subtle` (HTTPS) |
| Confirmation link says "invalid or expired" | older than `pending_hours`, already used, or `storage_dir` is not persistent or not writable |
| Everyone gets "domain already requested" | test data left in `shared/storage/domains/` |
| `{"error":"capacity"}` | `audit.weekly_cap` reached; entries expire after 7 days |
| Site redirects in a loop or to the wrong host | `.htaccess` canonical rule, check the TLS setup of both hostnames |
| Old content still visible | browser cache of images or fonts (30 days); HTML always revalidates |
| 403 for pages that should exist | a path starts with a blocked folder name (`docs`, `src`, `config`, ...) in `.htaccess` |
