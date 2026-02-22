#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

cd "$REPO_ROOT"
echo "[run.sh] GUI start-only for task 2.2 (R4 desktop shell)"
echo "[run.sh] Command: npm run desktop:dev"
exec npm run desktop:dev
