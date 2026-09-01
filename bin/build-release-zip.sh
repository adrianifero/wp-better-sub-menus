#!/usr/bin/env bash
# Build a WordPress.org-compatible zip: top-level folder must be wp-better-sub-menus.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VERSION="$(grep -E '^\s*\* Version:' wp_better_submenus.php | head -1 | awk '{print $3}')"
SLUG="wp-better-sub-menus"
STAGE="$(mktemp -d)"
OUT="${ROOT}/dist/${SLUG}-${VERSION}.zip"
rm -f "$OUT"

mkdir -p "${ROOT}/dist" "${STAGE}/${SLUG}/css" "${STAGE}/${SLUG}/js"
cp wp_better_submenus.php readme.txt "${STAGE}/${SLUG}/"
cp css/wpbetternav.admin.css "${STAGE}/${SLUG}/css/"
cp js/wpbetternav.admin.js "${STAGE}/${SLUG}/js/"

(
  cd "$STAGE"
  zip -r "$OUT" "$SLUG" -x '*/.DS_Store' '*/.git/*'
)

rm -rf "$STAGE"
echo "Wrote $OUT"
unzip -l "$OUT" | head -20
