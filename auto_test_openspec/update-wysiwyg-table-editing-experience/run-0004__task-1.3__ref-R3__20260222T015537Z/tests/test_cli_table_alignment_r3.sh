#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$RUN_DIR/../../.." && pwd)"
OUTPUT_DIR="$RUN_DIR/outputs"
LOG_FILE="$OUTPUT_DIR/cli-table-alignment.log"

mkdir -p "$OUTPUT_DIR"

cd "$REPO_ROOT"
echo "[cli] Running R3 table alignment marker tests" | tee "$LOG_FILE"
npm test -- --runInBand src/__tests__/markdownDocumentModel.test.ts -t "table alignment marker|alignment marker together|explicit table alignment marker" 2>&1 | tee -a "$LOG_FILE"
