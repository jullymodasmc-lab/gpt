#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_DIR="$ROOT_DIR/deploy"
SITE_DIR="$DEPLOY_DIR/site"
ZIP_FILE="$DEPLOY_DIR/jl-store-hostinger.zip"

rm -rf "$SITE_DIR"
mkdir -p "$SITE_DIR"

cp "$ROOT_DIR/index.html" "$SITE_DIR/"
cp "$ROOT_DIR/admin.html" "$SITE_DIR/"
cp "$ROOT_DIR/styles.css" "$SITE_DIR/"
cp "$ROOT_DIR/script.js" "$SITE_DIR/"
cp "$ROOT_DIR/admin.js" "$SITE_DIR/"
cp "$ROOT_DIR/logo-jl-store.svg" "$SITE_DIR/"

(
  cd "$SITE_DIR"
  zip -r "$ZIP_FILE" . >/dev/null
)

echo "Pacote gerado: $ZIP_FILE"
