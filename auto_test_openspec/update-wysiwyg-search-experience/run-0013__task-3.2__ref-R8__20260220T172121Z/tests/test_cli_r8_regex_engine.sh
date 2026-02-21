#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"

mkdir -p "${RUN_DIR}/outputs"

cd "$REPO_ROOT"
echo "[cli] running R8 regex matcher tests"
npm test -- src/utils/findMatchEngine.test.ts | tee "${RUN_DIR}/outputs/cli_test_output.txt"
