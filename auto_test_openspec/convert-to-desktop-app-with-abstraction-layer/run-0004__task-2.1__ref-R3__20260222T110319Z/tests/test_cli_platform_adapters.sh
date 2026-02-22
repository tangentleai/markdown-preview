#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$RUN_DIR/../../.." && pwd)"
LOG_DIR="$RUN_DIR/logs"
OUTPUT_DIR="$RUN_DIR/outputs"

mkdir -p "$LOG_DIR" "$OUTPUT_DIR"

{
  echo "[INFO] adapter CLI validation"
  echo "[INFO] UTC $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "[INFO] repo_root=$REPO_ROOT"
} > "$LOG_DIR/cli-run.log"

cd "$REPO_ROOT"

echo "[STEP] TypeScript typecheck (adapter scope)" | tee -a "$LOG_DIR/cli-run.log"
npx tsc --noEmit -p "$SCRIPT_DIR/tsconfig.adapters.json" 2>&1 | tee "$OUTPUT_DIR/typecheck.log"

echo "[STEP] Adapter contract tests" | tee -a "$LOG_DIR/cli-run.log"
npm run test -- --runInBand src/__tests__/adapterContracts.test.ts 2>&1 | tee "$OUTPUT_DIR/adapter-contract-tests.log"

echo "[STEP] Core contract tests (reused)" | tee -a "$LOG_DIR/cli-run.log"
npm run test -- --runInBand src/__tests__/coreBoundaryContracts.test.ts src/__tests__/coreSharedLogicMigration.test.ts 2>&1 | tee "$OUTPUT_DIR/core-contract-tests.log"
