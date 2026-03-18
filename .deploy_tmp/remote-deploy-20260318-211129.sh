#!/usr/bin/env bash
set -euo pipefail

TAR_PATH="$1"
TARGET_DIR="$2"
BACKUP_BASE="$3"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
STAGING_DIR="$(mktemp -d)"
BACKUP_DIR=""

cleanup() {
  rm -rf "$STAGING_DIR"
}
trap cleanup EXIT

mkdir -p "$BACKUP_BASE"

echo "==> Extracting archive..."
tar -xzf "$TAR_PATH" -C "$STAGING_DIR"

if [ -d "$TARGET_DIR" ] && [ -n "$(find "$TARGET_DIR" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]; then
  BACKUP_DIR="$BACKUP_BASE/site-$TIMESTAMP"
  mkdir -p "$BACKUP_DIR"
  echo "==> Backing up current site to $BACKUP_DIR"
  sudo cp -a "$TARGET_DIR"/. "$BACKUP_DIR"/
fi

echo "==> Replacing site files..."
sudo mkdir -p "$TARGET_DIR"
sudo find "$TARGET_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
sudo cp -a "$STAGING_DIR"/. "$TARGET_DIR"/
sudo chown -R www-data:www-data "$TARGET_DIR"

echo "==> Fixing permissions..."
sudo find "$TARGET_DIR" -type d -exec chmod 755 {} \;
sudo find "$TARGET_DIR" -type f -exec chmod 644 {} \;

echo "==> Reloading nginx..."
sudo systemctl reload nginx

echo "==> Cleaning up..."
rm -f "$TAR_PATH"

echo "Deployment complete."
if [ -n "$BACKUP_DIR" ]; then
  echo "Backup saved at: $BACKUP_DIR"
fi
