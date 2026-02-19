#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

cd "$REPO_ROOT"

echo "[RUN] GUI scope bundle: start-server-only"
echo "[URL] http://127.0.0.1:33100/"
echo "[INFO] Follow tests/gui_runbook_enter_backspace_rules.md for MCP validation steps"
echo "[INFO] Press Ctrl+C to stop the server."

npm run dev -- --host 127.0.0.1 --port 33100
