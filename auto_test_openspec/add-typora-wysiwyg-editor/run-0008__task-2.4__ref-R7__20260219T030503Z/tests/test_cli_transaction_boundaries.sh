#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
OUTPUT_FILE="$RUN_DIR/outputs/cli-transaction-boundary.txt"

mkdir -p "$RUN_DIR/outputs"

cd "$REPO_ROOT"

echo "[CLI] Running transaction boundary checks for task 2.4 (R7)"
npm test -- --runInBand src/__tests__/wysiwygBlockInputRules.test.ts src/__tests__/App.test.tsx | tee "$OUTPUT_FILE"
