#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$RUN_DIR/../../.." && pwd)"
LOG_FILE="$RUN_DIR/outputs/cli-hr-rendering.log"

mkdir -p "$RUN_DIR/outputs"

cd "$REPO_ROOT"
echo "[cli] Running horizontal-rule rendering assertions" | tee "$LOG_FILE"
npm test -- markdownDocumentModel.test.ts wysiwygBlockInputRules.test.ts 2>&1 | tee -a "$LOG_FILE"
