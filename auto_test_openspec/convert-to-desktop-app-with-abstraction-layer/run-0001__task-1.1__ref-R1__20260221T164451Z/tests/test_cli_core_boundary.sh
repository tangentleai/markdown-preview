#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$BUNDLE_DIR/../../.." && pwd)"
OUTPUT_DIR="$BUNDLE_DIR/outputs"

mkdir -p "$OUTPUT_DIR"

cd "$REPO_ROOT"

echo "[CHECK] static scan core boundary imports"
if node "$SCRIPT_DIR/test_cli_core_platform_scan.cjs" "$REPO_ROOT/src/core" "$OUTPUT_DIR/core-platform-api-violations.txt"; then
  :
else
  echo "[FAIL] found platform-specific APIs in src/core"
  exit 1
fi

echo "[CHECK] typecheck core boundary files"
npx tsc --noEmit --target ES2020 --module ESNext --moduleResolution bundler --lib ES2020,DOM --types jest src/core/index.ts src/__tests__/coreBoundaryContracts.test.ts > "$OUTPUT_DIR/core-typecheck.log" 2>&1

echo "[CHECK] run core contract unit test"
npm run test -- --runInBand src/__tests__/coreBoundaryContracts.test.ts > "$OUTPUT_DIR/core-contract-tests.log" 2>&1

echo "[DONE] core boundary validation commands finished"
