#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RUN_LOG="$SCRIPT_DIR/logs/run.log"
OUTPUT_LOG="$SCRIPT_DIR/outputs/cli-table-column-widths.log"

mkdir -p "$SCRIPT_DIR/logs" "$SCRIPT_DIR/outputs"

echo "[run.sh] SCOPE=CLI" | tee "$RUN_LOG"
echo "[run.sh] task=2.1 ref=R4" | tee -a "$RUN_LOG"

bash "$SCRIPT_DIR/tests/test_cli_table_column_widths_r4.sh" 2>&1 | tee "$OUTPUT_LOG"
EXIT_CODE=${PIPESTATUS[0]}

if ! grep -q "PASS" "$OUTPUT_LOG"; then
  echo "[run.sh] missing PASS in output" | tee -a "$RUN_LOG"
  EXIT_CODE=1
fi
if grep -q "FAIL" "$OUTPUT_LOG"; then
  echo "[run.sh] detected FAIL in output" | tee -a "$RUN_LOG"
  EXIT_CODE=1
fi

echo "[run.sh] exit_code=$EXIT_CODE" | tee -a "$RUN_LOG"
exit "$EXIT_CODE"
