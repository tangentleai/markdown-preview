#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$RUN_DIR/../../.." && pwd)"
LOG_DIR="$RUN_DIR/outputs"

mkdir -p "$LOG_DIR"
cd "$REPO_ROOT"

echo "[cli] Running table cell wrap style regression test"
npm test -- --runInBand src/__tests__/wysiwygTableCellWrapStyles.test.ts | tee "$LOG_DIR/cli-table-cell-wrap.log"
