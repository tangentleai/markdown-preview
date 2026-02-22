#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$RUN_DIR/../../.." && pwd)"

cd "$REPO_ROOT"
echo "[cli] Running table column width utility tests"
npm test -- --runInBand src/__tests__/wysiwygTableColumnWidths.test.ts
