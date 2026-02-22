#!/bin/bash
# Build frontend and deploy to /var/www/zurt. Run on VPS from project root.
# Usage: cd /home/Fintech-project && bash scripts/deploy-frontend.sh
# (Script will ask for sudo only when copying to /var/www.)

set -e
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="${PROJECT_ROOT}/frontend/dist"
DEPLOY_TO="/var/www/zurt"
NGINX_USER="${NGINX_USER:-www-data}"

echo "=== 1. Building frontend (2–5 min on 4GB RAM) ==="
cd "${PROJECT_ROOT}/frontend"
# build:minimal = fewer chunks, single CSS bundle → lower memory, more likely to create assets/
npm run build:minimal

if [ ! -f "${DIST}/index.html" ]; then
  echo "ERROR: Build did not produce index.html. Check the build output above."
  exit 1
fi
if [ ! -d "${DIST}/assets" ]; then
  echo "ERROR: Build did not produce assets/ folder. Check the build output above."
  exit 1
fi
echo "Build OK: index.html and assets/ found."

echo ""
echo "=== 2. Deploying to ${DEPLOY_TO} (sudo required) ==="
sudo mkdir -p "$DEPLOY_TO"
sudo rsync -a --delete "${DIST}/" "${DEPLOY_TO}/" 2>/dev/null || sudo cp -a "${DIST}/"* "${DEPLOY_TO}/"
sudo chown -R "${NGINX_USER}:${NGINX_USER}" "$DEPLOY_TO"
sudo chmod -R u=rX,g=rX,o=rX "$DEPLOY_TO"
echo "Deploy OK."

echo ""
echo "=== 3. Reload nginx ==="
sudo nginx -t && sudo systemctl reload nginx && echo "Nginx reloaded." || echo "Run: sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "Done. Open https://zurt.com.br and hard refresh (Ctrl+Shift+R)."
