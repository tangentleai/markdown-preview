#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$RUN_DIR/../../.." && pwd)"
LOG_FILE="$RUN_DIR/logs/cli_test.log"

cd "$REPO_ROOT"

CMD="npm run test -- --runInBand src/__tests__/coreBoundaryContracts.test.ts src/__tests__/coreSharedLogicMigration.test.ts src/__tests__/markdownDocumentModel.test.ts src/utils/findMatchEngine.test.ts src/__tests__/markdownFileIO.test.ts"

echo "[cli] running: $CMD" | tee "$LOG_FILE"
$CMD 2>&1 | tee -a "$LOG_FILE"
