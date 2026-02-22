#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$RUN_DIR/../../.." && pwd)"
OUTPUT_DIR="$RUN_DIR/outputs"
LOG_FILE="$OUTPUT_DIR/cli-table-resize.log"

mkdir -p "$OUTPUT_DIR"

cd "$REPO_ROOT"
echo "[cli] Running table resize utility tests" | tee "$LOG_FILE"
npm test -- --runInBand src/__tests__/wysiwygTableResize.test.ts 2>&1 | tee -a "$LOG_FILE"
