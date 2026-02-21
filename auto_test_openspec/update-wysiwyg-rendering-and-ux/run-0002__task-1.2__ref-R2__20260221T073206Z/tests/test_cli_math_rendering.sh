#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${RUN_DIR}/../../.." && pwd)"
OUTPUT_DIR="${RUN_DIR}/outputs"
LOG_FILE="${OUTPUT_DIR}/cli-math-rendering.log"

mkdir -p "$OUTPUT_DIR"

cd "$REPO_ROOT"

set +e
npm test -- markdownDocumentModel.test.ts >"$LOG_FILE" 2>&1
TEST_EXIT=$?
set -e

if [ "$TEST_EXIT" -ne 0 ]; then
  echo "CLI test command failed. See: $LOG_FILE"
  exit "$TEST_EXIT"
fi

node -e "const fs=require('fs');const log=fs.readFileSync(process.argv[1],'utf8');const required=['should render benchmark block LaTeX formula with \\\\[...\\\\] delimiters','should fallback to raw LaTeX text when block formula render fails','should parse and render inline \\\\(...\\\\) math syntax'];for (const item of required){if(!log.includes(item)){console.error('Missing expected assertion line:',item);process.exit(1);}}" "$LOG_FILE"

echo "CLI math rendering checks completed. Log: $LOG_FILE"
