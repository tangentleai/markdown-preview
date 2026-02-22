#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

cd "$REPO_ROOT"
echo "[run.sh] GUI start-only for task 1.2 (R2 unblock bundle)"
echo "[run.sh] URL: http://127.0.0.1:33100/"
echo "[run.sh] Preflight: close stale MCP/Chrome session before GUI runbook"
exec npm run dev
