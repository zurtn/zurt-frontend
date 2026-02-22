#!/bin/bash
# Run this ON THE VPS (from project root, as root or with sudo) to fix 403 Forbidden.
# Usage: cd /home/Fintech-project && sudo bash scripts/fix-nginx-403.sh [ path-to-project-root ] [ --deploy-to /var/www/zurt ]
#
# Examples (run from project root):
#   cd /home/Fintech-project && sudo bash scripts/fix-nginx-403.sh /home/Fintech-project --deploy-to /var/www/zurt
#   cd /home/Fintech-project && sudo bash scripts/fix-nginx-403.sh
# Then in nginx set: root /var/www/zurt;

set -e
PROJECT_ROOT="${1:-/home/Fintech-project}"
DIST="${PROJECT_ROOT}/frontend/dist"
NGINX_USER="${NGINX_USER:-www-data}"
DEPLOY_TO=""

if [ "$2" = "--deploy-to" ] && [ -n "$3" ]; then
  DEPLOY_TO="$3"
fi

echo "Project root: $PROJECT_ROOT"
echo "Frontend dist: $DIST"
echo "Nginx user: $NGINX_USER"

if [ ! -d "$DIST" ]; then
  echo "ERROR: Directory does not exist: $DIST"
  echo "Build the frontend first: cd frontend && npm run build"
  exit 1
fi

if [ ! -f "${DIST}/index.html" ]; then
  echo "WARNING: index.html not found in $DIST - creating minimal placeholder (run 'npm run build' in frontend/ for full app)"
  mkdir -p "$DIST"
  echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>zurT</title></head><body><p>Loading... Build the frontend: <code>cd frontend && npm run build</code> then run this script again.</p></body></html>' > "${DIST}/index.html"
fi

if [ -n "$DEPLOY_TO" ]; then
  echo "Deploying to: $DEPLOY_TO"
  mkdir -p "$DEPLOY_TO"
  rsync -a --delete "${DIST}/" "${DEPLOY_TO}/" 2>/dev/null || cp -a "${DIST}/"* "${DEPLOY_TO}/"
  chown -R "${NGINX_USER}:${NGINX_USER}" "$DEPLOY_TO"
  chmod -R u=rX,g=rX,o=rX "$DEPLOY_TO"
  echo "Done. In nginx set: root ${DEPLOY_TO};"
  echo "Then: sudo nginx -t && sudo systemctl reload nginx"
  exit 0
fi

# Ensure nginx can traverse every parent directory (required for root under /home)
DIR="$DIST"
while [ -n "$DIR" ] && [ "$DIR" != "/" ]; do
  chmod o+x "$DIR" 2>/dev/null || true
  DIR="$(dirname "$DIR")"
done

# Give nginx user read+execute on dist and its contents
chown -R "${NGINX_USER}:${NGINX_USER}" "$DIST"
chmod -R u=rX,g=rX,o=rX "$DIST"

echo "Permissions set. Reload nginx: sudo systemctl reload nginx"
echo "If 403 persists, deploy to /var/www: sudo $0 $PROJECT_ROOT --deploy-to /var/www/zurt"
echo "Then in /etc/nginx/sites-available/zurt.com.br set: root /var/www/zurt;"
