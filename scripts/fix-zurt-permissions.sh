#!/bin/bash
# Run on VPS after you have uploaded frontend dist to /var/www/zurt (e.g. via rsync/scp from your PC).
# Usage: sudo bash scripts/fix-zurt-permissions.sh

set -e
ZURT_ROOT="${1:-/var/www/zurt}"
NGINX_USER="${NGINX_USER:-www-data}"

echo "Setting ownership to ${NGINX_USER} for ${ZURT_ROOT}"
chown -R "${NGINX_USER}:${NGINX_USER}" "$ZURT_ROOT"
chmod -R u=rX,g=rX,o=rX "$ZURT_ROOT"
echo "Reloading nginx..."
nginx -t && systemctl reload nginx
echo "Done. Open https://zurt.com.br and hard refresh (Ctrl+Shift+R)."
