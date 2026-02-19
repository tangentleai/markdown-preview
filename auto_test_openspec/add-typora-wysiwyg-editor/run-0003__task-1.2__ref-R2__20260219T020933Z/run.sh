#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"
OUTPUT_DIR="$SCRIPT_DIR/outputs"

mkdir -p "$LOG_DIR" "$OUTPUT_DIR"

{
  echo "[INFO] RUN #0003 task=1.2 ref=R2"
  echo "[INFO] UTC $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "[INFO] bundle_dir=$SCRIPT_DIR"
} > "$LOG_DIR/run.log"

bash "$SCRIPT_DIR/tests/test_cli_markdown_import.sh" 2>&1 | tee "$OUTPUT_DIR/test-output.txt"

echo "[INFO] CLI validation completed" | tee -a "$LOG_DIR/run.log"
