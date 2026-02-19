#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_DIR="$(cd "$BUNDLE_DIR/../../.." && pwd)"

echo "[TEST] block input rules transaction + undo + regression"
echo "[TEST] repo_dir=$REPO_DIR"

cd "$REPO_DIR"
npm test -- wysiwygBlockInputRules App markdownDocumentModel
