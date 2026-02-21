#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${BUNDLE_DIR}/../../.." && pwd)"
OUTPUT_LOG="${BUNDLE_DIR}/outputs/cli-r10-regression.log"

mkdir -p "${BUNDLE_DIR}/outputs"

cd "$REPO_ROOT"

node <<'NODE' > "$OUTPUT_LOG"
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const repoRoot = process.cwd()
const appFile = readFileSync(join(repoRoot, 'src/App.tsx'), 'utf8')
const editorFile = readFileSync(join(repoRoot, 'src/components/WysiwygEditor.tsx'), 'utf8')

const checks = [
  {
    label: 'desktop breakpoint layout class exists',
    ok: appFile.includes('lg:grid-cols-[var(--outline-width)_10px_minmax(0,1fr)]')
  },
  {
    label: 'mobile drawer trigger exists',
    ok: appFile.includes('aria-label="打开移动端大纲抽屉"') && appFile.includes('lg:hidden px-1')
  },
  {
    label: 'mobile drawer container exists',
    ok: appFile.includes('aria-label="移动端标题大纲抽屉"')
  },
  {
    label: 'light shadow focus class exists',
    ok: editorFile.includes('focus:shadow-[0_0_0_1px_rgba(148,163,184,0.7),0_10px_24px_rgba(15,23,42,0.12)]')
  },
  {
    label: 'legacy blue focus ring removed',
    ok: !editorFile.includes('focus:ring-blue-500')
  }
]

let failed = false
for (const check of checks) {
  if (check.ok) {
    console.log(`[pass] ${check.label}`)
  } else {
    console.log(`[fail] ${check.label}`)
    failed = true
  }
}

if (failed) {
  process.exit(1)
}

console.log('[pass] all R10 CLI style/layout regression checks passed')
NODE

cat "$OUTPUT_LOG"
