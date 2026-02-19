#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_DIR="$(cd "$BUNDLE_DIR/../../.." && pwd)"

echo "[TEST] markdown import parser suite"
echo "[TEST] repo_dir=$REPO_DIR"

cd "$REPO_DIR"
npm test -- markdownDocumentModel
