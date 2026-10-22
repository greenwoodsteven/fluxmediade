#!/usr/bin/env bash
# Simple route (git pull + upload): build locally and send out/ to the server as one tar stream over SSH.
# No rsync or FTP client needed on either side; the api -> ../api link in the server's out/ is never touched.
# Default: the server's out/ is emptied completely (old chunks, removed pages), except the `api` link, and replaced by
# the new build. The new files are uploaded to out.new/ first and swapped in at the end, so a failed upload leaves the
# live site untouched and the gap is a fraction of a second.
# Usage: deploy/upload.sh              build:prod, upload, empty out/, swap in, verify
#        deploy/upload.sh --pull       also run `git pull` in the server's clone first (when api/ changed)
#        deploy/upload.sh --no-build   upload the existing out/ without rebuilding
#        deploy/upload.sh --keep-old   do not empty out/: only overwrite files (old files stay)
# Config: none needed. Defaults: UPLOAD_HOST=hosting161521@fluxmedia.de, UPLOAD_REPO=/httpdocs/_fluxmediade.
# Override them in deploy/.env (git-ignored, optional), see deploy/.env.example
set -euo pipefail
cd "$(dirname "$0")/.."
# shellcheck disable=SC1091
[[ -f deploy/.env ]] && source deploy/.env
: "${UPLOAD_HOST:=hosting161521@fluxmedia.de}"
: "${UPLOAD_REPO:=/httpdocs/_fluxmediade}"
: "${SITE_URL:=https://www.fluxmedia.de}"

BUILD=1; PULL=0; CLEAN=1
for arg in "$@"; do
  case "$arg" in
    --no-build) BUILD=0 ;;
    --pull) PULL=1 ;;
    --keep-old) CLEAN=0 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

if [[ $BUILD == 1 ]]; then
  npm run build:prod          # strict site check (fails on [PLACEHOLDER]) + build
fi
[[ -f out/index.html ]] || { echo "out/ is missing, run npm run build:prod" >&2; exit 1; }
[[ -e out/api ]] && { echo "out/api exists locally; it must not be uploaded" >&2; exit 1; }

if [[ $PULL == 1 ]]; then
  ssh "$UPLOAD_HOST" "cd $UPLOAD_REPO && git pull"
fi
R="$UPLOAD_REPO"
# Never let an empty variable turn the paths below into /out
[[ "$R" == /*/* ]] || { echo "UPLOAD_REPO looks wrong: $R" >&2; exit 1; }

if [[ $CLEAN == 1 ]]; then
  echo "uploading out/ to $UPLOAD_HOST:$R/out.new, then replacing out/ ..."
  # COPYFILE_DISABLE: no macOS ._ files in the archive; .DS_Store is excluded as well
  ssh "$UPLOAD_HOST" "rm -rf $R/out.new && mkdir -p $R/out.new"
  COPYFILE_DISABLE=1 tar czf - --no-xattrs --exclude .DS_Store -C out . | ssh "$UPLOAD_HOST" "tar xzf - --no-same-owner -C $R/out.new"
  # empty out/ (hidden files too) except the api link, copy the new build in, restore the link
  ssh "$UPLOAD_HOST" "set -e; cd $R; test -f out.new/index.html
    find out -mindepth 1 -maxdepth 1 ! -name api -exec rm -rf {} +
    cp -a out.new/. out/ && rm -rf out.new
    [ -L out/api ] || ln -s ../api out/api"
else
  echo "uploading out/ to $UPLOAD_HOST:$R/out (overwrite only) ..."
  COPYFILE_DISABLE=1 tar czf - --no-xattrs --exclude .DS_Store -C out . | ssh "$UPLOAD_HOST" "tar xzf - --no-same-owner -C $R/out"
fi

# Verify: same number of route payload files local and remote, and the api link still resolves
local_n=$(find out -name '__next._tree.txt' | wc -l | tr -d ' ')
remote_n=$(ssh "$UPLOAD_HOST" "find $UPLOAD_REPO/out -name '__next._tree.txt' | wc -l" | tr -d ' ')
echo "route files: local $local_n, server $remote_n"
[[ "$local_n" == "$remote_n" ]] || { echo "MISMATCH: files are missing on the server" >&2; exit 1; }
ssh "$UPLOAD_HOST" "test -f $UPLOAD_REPO/out/api/challenge.php" || echo "WARNING: out/api link is missing or broken (ln -sfn ../api $UPLOAD_REPO/out/api)" >&2
code=$(curl -s -o /dev/null -w '%{http_code}' "$SITE_URL/leistungen/__next._tree.txt")
echo "GET /leistungen/__next._tree.txt -> $code"
echo "uploaded. Now hard-reload the site and run the smoke test (deploy/README.md)."
