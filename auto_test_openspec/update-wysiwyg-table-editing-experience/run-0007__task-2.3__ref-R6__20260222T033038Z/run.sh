#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
PORT="33100"
URL="http://127.0.0.1:${PORT}/"

cd "$REPO_ROOT"
printf '[run.sh] Starting dev server for MIXED GUI validation startup only\n'
printf '[run.sh] URL: %s\n' "$URL"
npm run dev -- --host 127.0.0.1 --port "$PORT"
