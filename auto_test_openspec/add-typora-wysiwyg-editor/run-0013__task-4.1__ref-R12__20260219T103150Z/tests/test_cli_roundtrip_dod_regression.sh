#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

mkdir -p "$RUN_DIR/outputs"

RAW_LOG="$RUN_DIR/outputs/jest-dod-regression.log"
RAW_JSON="$RUN_DIR/outputs/jest-dod-regression.json"
REPORT_TXT="$RUN_DIR/outputs/dod-regression-report.txt"
SUMMARY_JSON="$RUN_DIR/outputs/dod-regression-summary.json"

cd "$REPO_ROOT"

echo "[CLI] Running task 4.1 DoD regression suite (round-trip + core interactions)"

set +e
npm test -- --runInBand src/__tests__/wysiwygDodRegression.test.tsx --json --outputFile "$RAW_JSON" > "$RAW_LOG" 2>&1
JEST_EXIT=$?
set -e

node "$RUN_DIR/tests/render_dod_report.mjs" "$RAW_JSON" "$REPORT_TXT" "$SUMMARY_JSON" "$JEST_EXIT"

cat "$REPORT_TXT"

if [ "$JEST_EXIT" -ne 0 ]; then
  exit "$JEST_EXIT"
fi
