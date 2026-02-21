#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
RUN_LOG="$SCRIPT_DIR/logs/run.log"
OUTPUT_LOG="$SCRIPT_DIR/outputs/cli-math-performance.log"

mkdir -p "$SCRIPT_DIR/logs" "$SCRIPT_DIR/outputs"

echo "[run.sh] SCOPE=CLI" | tee "$RUN_LOG"
echo "[run.sh] task=1.4 ref=R4" | tee -a "$RUN_LOG"

bash "$SCRIPT_DIR/tests/test_cli_math_performance.sh" 2>&1 | tee "$OUTPUT_LOG"
EXIT_CODE=${PIPESTATUS[0]}

echo "[run.sh] exit_code=$EXIT_CODE" | tee -a "$RUN_LOG"
exit "$EXIT_CODE"
