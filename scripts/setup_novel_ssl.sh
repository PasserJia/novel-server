#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-novel.passerjia.com}"
EXPECTED_IP="${EXPECTED_IP:-119.45.12.20}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/conf.d/port_mapping.conf}"
UPSTREAM="${UPSTREAM:-http://127.0.0.1:3000}"
EMAIL="${EMAIL:-}"

if [[ "$(id -u)" -ne 0 ]]; then
  exec sudo -E bash "$0" "$@"
fi

echo "==> Checking DNS for ${DOMAIN}"
if ! getent hosts "$DOMAIN" | awk '{print $1}' | grep -qx "$EXPECTED_IP"; then
  echo "ERROR: ${DOMAIN} does not resolve to ${EXPECTED_IP} on this server." >&2
  getent hosts "$DOMAIN" || true
  exit 1
fi

echo "==> Checking nginx config file"
if [[ ! -f "$NGINX_CONF" ]]; then
  echo "ERROR: nginx config not found: ${NGINX_CONF}" >&2
  exit 1
fi
if ! grep -q "server_name[[:space:]]\\+${DOMAIN}" "$NGINX_CONF"; then
  echo "ERROR: ${NGINX_CONF} does not contain server_name ${DOMAIN}" >&2
  exit 1
fi
if ! grep -q "proxy_pass[[:space:]]\\+${UPSTREAM}" "$NGINX_CONF"; then
  echo "ERROR: ${NGINX_CONF} does not proxy to ${UPSTREAM}" >&2
  exit 1
fi

echo "==> Backing up nginx config"
cp -a "$NGINX_CONF" "${NGINX_CONF}.bak-$(date +%Y%m%d%H%M%S)"

echo "==> Installing certbot from snap if needed"
if ! command -v snap >/dev/null 2>&1; then
  apt-get update
  apt-get install -y snapd
fi
snap install core >/dev/null || true
snap refresh core >/dev/null || true
if ! snap list certbot >/dev/null 2>&1; then
  snap install --classic certbot
fi
ln -sf /snap/bin/certbot /usr/bin/certbot

echo "==> Testing nginx before certificate request"
nginx -t

echo "==> Requesting Let's Encrypt certificate for ${DOMAIN}"
certbot_args=(
  --nginx
  -d "$DOMAIN"
  --agree-tos
  --non-interactive
  --redirect
)
if [[ -n "$EMAIL" ]]; then
  certbot_args+=(--email "$EMAIL")
else
  certbot_args+=(--register-unsafely-without-email)
fi
certbot "${certbot_args[@]}"

echo "==> Testing and reloading nginx"
nginx -t
systemctl reload nginx

echo "==> Checking local HTTPS endpoint"
curl -I --max-time 15 --resolve "${DOMAIN}:443:127.0.0.1" "https://${DOMAIN}/"

echo "==> Checking public HTTPS endpoint"
if ! curl -I --max-time 15 "https://${DOMAIN}/"; then
  echo "WARNING: Local HTTPS is working, but public HTTPS did not respond." >&2
  echo "WARNING: Check the cloud security group and allow inbound TCP 443." >&2
fi

echo "==> SSL setup complete: https://${DOMAIN}/"
