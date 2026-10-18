# Deployment (netcup shared hosting)

1. `cp deploy/.env.example deploy/.env` and fill in `DEPLOY_HOST` / `DEPLOY_PATH` (never commit `.env`).
2. One-time on the server: create `shared/config.php` from `api/config.example.php` (real SMTP password; rotate the
   old mailbox password first), point the domain's document root at `$DEPLOY_PATH/current`.
   In that config set `secret` (`openssl rand -hex 32`) and `storage_dir` to a folder outside the releases, e.g.
   `$DEPLOY_PATH/shared/storage` (create it, mode 700). It holds the free-analysis state (pending confirmations,
   domain history, weekly cap); inside a release folder a deploy would reset the limits.
3. `deploy/deploy.sh` builds `out/`, uploads a release, copies `api/` next to it and switches `current`.
4. `deploy/deploy.sh rollback` restores the previous release.

If symlinks are not allowed on the plan, rsync `out/` and `api/` straight into the webroot with
`--delete --exclude 'api/config.php'` so the untracked config survives.

Staging: use `deploy/staging.htaccess.example` (noindex + password) on `staging.fluxmedia.de`.
