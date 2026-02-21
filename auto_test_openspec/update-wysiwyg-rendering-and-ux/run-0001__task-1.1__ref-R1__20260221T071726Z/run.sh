#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

cd "$REPO_ROOT"
echo "[run.sh] SCOPE=MIXED (GUI start-server only)"
echo "[run.sh] URL: http://127.0.0.1:33100/"
exec npm run dev -- --host 127.0.0.1 --port 33100
