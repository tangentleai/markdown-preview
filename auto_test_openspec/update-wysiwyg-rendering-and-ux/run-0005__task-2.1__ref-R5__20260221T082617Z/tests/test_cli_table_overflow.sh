#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${BUNDLE_DIR}/../../.." && pwd)"
OUTPUT_LOG="${BUNDLE_DIR}/outputs/cli-table-overflow.log"

mkdir -p "${BUNDLE_DIR}/outputs"

cd "$REPO_ROOT"
echo "[cli] Running overflow table wrapper unit tests" | tee "$OUTPUT_LOG"
npm test -- wysiwygTableOverflow.test.ts 2>&1 | tee -a "$OUTPUT_LOG"

if ! grep -Fq 'wraps table in horizontal scroll container when table overflows editor width' "$OUTPUT_LOG"; then
  echo '[cli] expected overflow wrap assertion title not found in log' >&2
  exit 1
fi

if ! grep -Fq 'unwraps previously wrapped table after overflow is gone' "$OUTPUT_LOG"; then
  echo '[cli] expected unwrap assertion title not found in log' >&2
  exit 1
fi

echo '[cli] table overflow checks passed'
