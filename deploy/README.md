# Deployment (netcup shared hosting)

Two ways to deploy. **[Simple: `git pull` + FTP](#simple-deployment-git-pull--ftp)** needs nothing but an FTP client and
git on the server and is enough for this site. The release-folder route below (script, atomic switch, rollback) is the
optional upgrade; both build on your machine, because the server never needs Node.

## Release-folder deployment

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

## Alternative: deployment via git

The site is a static export, so the **server never builds anything**. Node and the image tooling are not available
on shared hosting, and they are not needed: git only has to move the finished `out/` and `api/` there. Two ways, both
using the same release folders, `shared/config.php`, `shared/storage` and `current` symlink as above. Both need a
git remote (GitHub, GitLab or similar), which this repository does not have yet.

| | A. CI builds and deploys on push (recommended) | B. Built artifacts in a `release` branch, server pulls |
|---|---|---|
| Trigger | `git push` to `master` (or a `v*` tag) | `deploy/release.sh` locally, then one `ssh` command |
| Build happens | on the CI runner | on your machine |
| Needs on the server | SSH + rsync (as now) | SSH + `git`, no inbound rsync |
| Git history | source only | source plus a second branch with generated files |
| Best when | you want push-to-deploy and a clean audit trail | the CI runner cannot reach the server, or only `git` is available |

Check first whether your netcup plan offers SSH and `git` on the server (this varies by package).

### A. CI builds and deploys

1. Create a deploy-only SSH key pair (`ssh-keygen -t ed25519 -f flux-deploy -N ""`), add the public key to
   `~/.ssh/authorized_keys` on the server, and keep the private key out of the repository.
2. Add these as repository secrets: `DEPLOY_HOST` (`user@host`), `DEPLOY_PATH`, `DEPLOY_KEY` (private key),
   `DEPLOY_KNOWN_HOSTS` (output of `ssh-keyscan host`, so the host key is pinned), and `SITE_LOCAL_JSON` (the content
   of `config/site.local.json`, which is not in git).
3. Add `.github/workflows/deploy.yml` (GitLab CI works the same way with the same steps):

```yaml
name: deploy
on:
  push:
    branches: [master]
  workflow_dispatch: {}
concurrency: deploy          # never two deploys at once
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # optional: require a manual approval in the repository settings
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - name: Business data and deploy settings
        env:
          SITE_LOCAL_JSON: ${{ secrets.SITE_LOCAL_JSON }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
          DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
        run: |
          printf '%s' "$SITE_LOCAL_JSON" > config/site.local.json
          printf 'DEPLOY_HOST=%s\nDEPLOY_PATH=%s\n' "$DEPLOY_HOST" "$DEPLOY_PATH" > deploy/.env
          mkdir -p ~/.ssh && chmod 700 ~/.ssh
          printf '%s\n' "$DEPLOY_KEY" > ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519
          printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
      - run: deploy/deploy.sh   # strict site check, build, rsync, symlink switch, keeps 5 releases
```

   The workflow reuses `deploy/deploy.sh`, so local and CI deploys behave the same. A placeholder left in
   `site.local.json` fails the run before anything is uploaded.
4. Run the smoke test from section 4 against the live site after the first run.

Notes
- **Rollback:** `deploy/deploy.sh rollback` from your machine, or re-run the workflow on an older commit
  (`workflow_dispatch` on that ref). The old release folders stay on the server (newest five).
- **Quality gate:** add the Lighthouse/axe run as a job before `deploy` once it is scripted; today it is manual.
- **Secrets:** the deploy key can only log in to this one account; give it a dedicated server user if the plan allows.
  Never print secrets in the log, and rotate the key if the repository access changes.
- **Pull requests:** do not run the deploy job for forks or pull requests (secrets would be exposed); the trigger above
  only fires on pushes to `master`.

### B. Built artifacts in a `release` branch

Only for the case that the server can run `git pull` but nothing can push to it.

1. **Once, on your machine:** create an orphan branch that holds only built files.

   ```bash
   git worktree add --orphan -b release ../fluxmedia-release   # git 2.42+, else: git checkout --orphan release
   ```

2. **Each release, on your machine** (a `deploy/release.sh` would wrap these steps):

   ```bash
   node scripts/site-config.mjs --strict && npm run build
   rsync -a --delete --exclude '.git' out/ ../fluxmedia-release/
   rsync -a --exclude 'config*.php' --exclude 'storage/' api/ ../fluxmedia-release/api/
   git -C ../fluxmedia-release add -A
   git -C ../fluxmedia-release commit -m "release $(date +%Y%m%d-%H%M%S) from $(git rev-parse --short HEAD)"
   git -C ../fluxmedia-release push origin release
   ```

3. **Once, on the server:** clone the branch next to the releases and give it read-only access to the remote (a
   deploy key without write permission).

   ```bash
   git clone --branch release --single-branch --depth 1 git@github.com:ORG/fluxmedia-site.git $DEPLOY_PATH/repo
   ```

4. **Each release, on the server** (run it over `ssh`, or from a small script in `$DEPLOY_PATH`):

   ```bash
   cd $DEPLOY_PATH && TS=$(date +%Y%m%d-%H%M%S)
   git -C repo fetch --depth 1 origin release && git -C repo reset --hard origin/release
   mkdir -p releases/$TS && rsync -a --exclude '.git' repo/ releases/$TS/
   ln -sfn $DEPLOY_PATH/shared/config.php releases/$TS/api/config.php
   ln -sfn releases/$TS current
   ls -1dt releases/* | tail -n +6 | xargs -r rm -rf
   ```

   The copy into a new release folder keeps the switch atomic and the rollback identical to section 5.

Notes
- The generated images make the `release` branch large. Squash it now and then (`git checkout --orphan` and force
  push) so the history does not keep every build.
- Do not commit `config*.php` or anything from `shared/` to that branch. The business data in
  `config/site.local.json` is baked into the HTML at build time, so the branch contains the public Impressum values
  but never the SMTP password or `secret`.
- Never serve the server's `repo/` folder: it holds `.git`. Only `current` may be the document root.

## Simple deployment: git pull + FTP

The static site (`out/`) is built on your machine and uploaded by FTP. The PHP endpoints (`api/`) come from git on the
server. `out/` is **not** tracked in git (it contains your Impressum data), so there is nothing to build on the server.

```
~/fluxmedia-site/          <- git clone (source, api/, config); NOT in the webroot
│   └── api/config.php     <- real credentials, git-ignored, survives every `git pull`
~/fluxmedia-storage/       <- state of the free analysis (create it, mode 700)
<webroot>/                 <- the domain's document root: contents of out/ (FTP)
    ├── index.html, _next/, images/, .htaccess, ...
    └── api -> ~/fluxmedia-site/api     <- symlink
```

Never clone the repository into the webroot: `.git`, `src/`, `docs/` and `config/` would be web-accessible.

### One time

1. Check what the server has: `ssh user@host 'command -v git php'`.
2. Give the server read access to the repository (a read-only deploy key: `ssh-keygen -t ed25519`, add the public key
   to the repository settings), then clone **outside** the webroot:
   `git clone git@github.com:ORG/fluxmedia-site.git ~/fluxmedia-site`
3. Create the config and the storage folder:
   ```bash
   mkdir -p ~/fluxmedia-storage && chmod 700 ~/fluxmedia-storage
   cp ~/fluxmedia-site/api/config.example.php ~/fluxmedia-site/api/config.php && chmod 600 ~/fluxmedia-site/api/config.php
   ```
   Edit `config.php`: real SMTP login (rotate the old password first), `secret` (`openssl rand -hex 32`),
   `base_url` (`https://www.fluxmedia.de`), `storage_dir` (`/full/path/to/fluxmedia-storage`), `allowed_origins`.
4. Link the endpoints into the webroot: `ln -s ~/fluxmedia-site/api <webroot>/api`. If the plan does not allow
   symlinks, copy instead (`cp -r ~/fluxmedia-site/api <webroot>/api`) and repeat the copy after each `git pull`
   (keep `config.php` out of that copy loop, or copy it once).
5. Point the domain at the webroot, choose PHP 8.x and enable the TLS certificate (customer control panel).

### Every release

1. **On your machine:** commit and push your changes, make sure `config/site.local.json` has no `[...]` left, then
   ```bash
   node scripts/site-config.mjs --strict && npm run build
   ```
2. **On the server, only if `api/` changed:** `cd ~/fluxmedia-site && git pull`.
   Do this together with step 3: the forms (JavaScript in `out/`) and the PHP endpoints must be the same version.
3. **FTP `out/` to the webroot.** Upload the **contents** of `out/`, not the folder itself.
   - Show hidden files in your client; `.htaccess` is in `out/` and must be uploaded every time.
   - Overwrite existing files, and do **not** delete or overwrite the `api` link/folder in the webroot.
   - Upload order, to avoid a broken page while the upload runs: first `_next/` and `images/`, then everything else, the
     HTML files last.
   - Transfer mode "binary" (or "auto" in FileZilla), never "ASCII".
   - Command-line alternative: `lftp -u USER sftp://HOST -e "mirror -R --only-newer --exclude '^api$' out/ /webroot; quit"`.
     Add `--delete` to also remove old files (still excluding `api`), see the note below.
4. **Smoke test** (section 4 above): home page, a 404, the free-analysis form end to end, `api/lib/` returns 403.

### Notes

- **Old files:** overwriting never removes files from earlier builds, so old `_next/static/chunks/*` pile up. They are
  harmless. About once a month, delete `_next/` in the webroot and upload the new one, or use `lftp ... --delete`.
- **Not atomic:** visitors can briefly see a mix of old and new files while the upload runs. Upload outside busy hours.
- **Rollback:** `git checkout <commit>` on the server for the PHP part, and rebuild the old commit locally and upload
  it again for the static part. Keep a ZIP of each uploaded `out/` (`out-YYYYMMDD.zip`) to make that quick.
- **Changing only text or prices:** edit the JSON, rebuild, upload `out/`; no `git pull` needed on the server.
- **Changing only PHP:** `git pull` on the server; no FTP needed.
- **Plain FTP is unencrypted:** use SFTP or FTPS if the plan offers it; otherwise at least avoid public Wi-Fi.
- **`git pull` fails with local changes:** you edited a tracked file on the server. `git status` shows which; the
  `config.php` is git-ignored and never causes this.

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
