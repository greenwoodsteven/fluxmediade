#!/usr/bin/env bash
# Build locally, rsync into a timestamped release folder on netcup, switch the `current` symlink.
# Usage: deploy/deploy.sh            (production)
#        deploy/deploy.sh rollback   (point `current` at the previous release)
# Config: deploy/.env (git-ignored) with DEPLOY_HOST=user@host and DEPLOY_PATH=/path/to/site
# Server layout:  $DEPLOY_PATH/{releases/<ts>/, shared/config.php, current -> releases/<ts>}
# The domain's document root points at $DEPLOY_PATH/current. If the plan does not allow symlinks
# (FollowSymLinks / SymLinksIfOwnerMatch), rsync straight into the webroot instead:
#   rsync -az --delete --exclude 'api/config.php' out/ api/ ... (see deploy/README.md)
set -euo pipefail
cd "$(dirname "$0")/.."
# shellcheck disable=SC1091
source deploy/.env
: "${DEPLOY_HOST:?}" "${DEPLOY_PATH:?}"

if [[ "${1:-}" == "rollback" ]]; then
  ssh "$DEPLOY_HOST" "cd $DEPLOY_PATH && prev=\$(ls -1 releases | tail -n 2 | head -n 1) && ln -sfn releases/\$prev current && echo rolled back to \$prev"
  exit 0
fi

TS=$(date +%Y%m%d-%H%M%S)
REL="$DEPLOY_PATH/releases/$TS"

npm run build
rsync -az --delete out/ "$DEPLOY_HOST:$REL/"
# PHP endpoints live in api/ and are never produced by the build; config stays outside the release.
rsync -az --exclude 'config.php' --exclude 'config.local.php' --exclude 'config.example.php' api/ "$DEPLOY_HOST:$REL/api/"
ssh "$DEPLOY_HOST" "ln -sfn $DEPLOY_PATH/shared/config.php $REL/api/config.php && ln -sfn releases/$TS $DEPLOY_PATH/current && ls -1dt $DEPLOY_PATH/releases/* | tail -n +6 | xargs -r rm -rf"
echo "deployed $TS"
