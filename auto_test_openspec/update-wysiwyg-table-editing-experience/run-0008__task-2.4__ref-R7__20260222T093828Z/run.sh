#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

cd "$REPO_ROOT"
echo "[run.sh] Starting app server for MIXED GUI MCP validation"
echo "[run.sh] URL: http://127.0.0.1:33100/"
npm run dev -- --host 127.0.0.1 --port 33100
