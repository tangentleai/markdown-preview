#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

cd "$REPO_ROOT"

echo "Desktop dev server: http://localhost:33100/desktop.html"

echo "Starting desktop app (Electron + Vite dev server)..."

npm run desktop:dev
