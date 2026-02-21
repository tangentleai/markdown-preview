#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

cd "$REPO_ROOT"
echo "[test_cli_math_performance.sh] running npm test -- mathRenderingPerformance.test.ts"
npm test -- mathRenderingPerformance.test.ts
