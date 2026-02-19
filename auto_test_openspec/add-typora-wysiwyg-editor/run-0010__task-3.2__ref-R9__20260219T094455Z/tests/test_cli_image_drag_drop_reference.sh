#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
OUTPUT_FILE="$RUN_DIR/outputs/cli-image-drag-drop-reference.txt"

mkdir -p "$RUN_DIR/outputs"

cd "$REPO_ROOT"

echo "[CLI] Running image drag-drop markdown reference checks for task 3.2 (R9)"
npm test -- --runInBand src/__tests__/App.test.tsx --testNamePattern "insert dropped local image" 2>&1 | tee "$OUTPUT_FILE"
