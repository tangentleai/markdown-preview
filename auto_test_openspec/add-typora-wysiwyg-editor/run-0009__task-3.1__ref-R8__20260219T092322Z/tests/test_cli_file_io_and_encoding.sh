#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
OUTPUT_FILE="$RUN_DIR/outputs/cli-file-io-and-encoding.txt"

mkdir -p "$RUN_DIR/outputs"

cd "$REPO_ROOT"

echo "[CLI] Running file I/O and save-flow checks for task 3.1 (R8)"
npm test -- --runInBand src/__tests__/markdownFileIO.test.ts src/__tests__/App.test.tsx | tee "$OUTPUT_FILE"
