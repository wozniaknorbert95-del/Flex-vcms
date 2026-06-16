#!/bin/bash
set -e

echo "=== PH4-016 SESSION A: VPS HARDENING ==="

# 1. Enable fail2ban
echo "[1/6] Installing and configuring fail2ban..."
apt-get update -yqq
apt-get install -yqq fail2ban

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 5
findtime = 600
EOF

systemctl enable fail2ban
systemctl restart fail2ban
echo "fail2ban is now $(systemctl is-active fail2ban)"

# 2. Nginx security headers
echo "[2/6] Adding Nginx security headers..."
NGINX_SITE_CONF="/etc/nginx/sites-available/vcms"

if [ -f "$NGINX_SITE_CONF" ]; then
  # Remove old duplicate headers if present
  sed -i '/Strict-Transport-Security/d' "$NGINX_SITE_CONF"
  sed -i '/X-Frame-Options/d' "$NGINX_SITE_CONF"
  sed -i '/X-Content-Type-Options/d' "$NGINX_SITE_CONF"
  sed -i '/Referrer-Policy/d' "$NGINX_SITE_CONF"
  sed -i '/Permissions-Policy/d' "$NGINX_SITE_CONF"
  sed -i '/X-XSS-Protection/d' "$NGINX_SITE_CONF"

  # Insert headers before the first location block
  sed -i '/location \//i \
    # Security headers (always, even on 401/404)\
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\
    add_header X-Frame-Options "DENY" always;\
    add_header X-Content-Type-Options "nosniff" always;\
    add_header Referrer-Policy "no-referrer" always;\
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()" always;\
    add_header X-XSS-Protection "1; mode=block" always;' "$NGINX_SITE_CONF"
else
  echo "WARNING: /etc/nginx/sites-available/vcms not found. Headers skipped."
fi

# 3. pm2-logrotate
echo "[3/6] Installing pm2-logrotate..."
if command -v pm2 &> /dev/null; then
  pm2 install pm2-logrotate || true
  pm2 set pm2-logrotate:max_size 10M
  pm2 set pm2-logrotate:retain 7
  pm2 set pm2-logrotate:compress true
  pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
else
  echo "WARNING: pm2 not found in PATH."
fi

# 4. Disable server_tokens
echo "[4/6] Disabling Nginx server_tokens..."
NGINX_CONF="/etc/nginx/nginx.conf"
if ! grep -q "server_tokens off;" "$NGINX_CONF"; then
  sed -i '/http {/a \    server_tokens off;' "$NGINX_CONF"
fi

# 5. TLS 1.2+ Only
echo "[5/6] Enforcing TLS 1.2+ globally..."
sed -i 's/ssl_protocols.*/ssl_protocols TLSv1.2 TLSv1.3;/' "$NGINX_CONF"

# 6. Remove unused port 8010
echo "[6/6] Removing unused port 8010 block..."
if [ -f "$NGINX_SITE_CONF" ]; then
  # Simple removal of lines containing 'listen 8010;' (May leave empty server blocks, but prevents listening)
  sed -i '/listen 8010;/d' "$NGINX_SITE_CONF"
fi

echo "[x] Testing Nginx and reloading..."
nginx -t && systemctl reload nginx

echo "=== VPS HARDENING COMPLETED ==="
