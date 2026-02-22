const fs = require('fs')
const path = require('path')

const sourceDir = process.argv[2]
const outputFile = process.argv[3]

if (!sourceDir || !outputFile) {
  process.stderr.write('Usage: node test_cli_core_platform_scan.cjs <sourceDir> <outputFile>\n')
  process.exit(2)
}

const bannedPatterns = [
  /\bwindow\b/g,
  /\bHTMLElement\b/g,
  /\bshowOpenFilePicker\b/g,
  /\bshowSaveFilePicker\b/g,
  /\bprocess\b/g,
  /\bBuffer\b/g,
  /\brequire\s*\(/g,
  /\belectron\b/g,
  /\bnode:fs\b/g,
  /\bnode:path\b/g,
  /from\s+['\"]fs['\"]/g,
  /from\s+['\"]path['\"]/g,
  /from\s+['\"]electron['\"]/g
]

const files = []

const walk = (currentPath) => {
  for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
    const entryPath = path.join(currentPath, entry.name)
    if (entry.isDirectory()) {
      walk(entryPath)
      continue
    }

    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(entryPath)
    }
  }
}

walk(sourceDir)

const violations = []
for (const filePath of files) {
  const source = fs.readFileSync(filePath, 'utf8')
  for (const pattern of bannedPatterns) {
    pattern.lastIndex = 0
    if (pattern.test(source)) {
      violations.push(`${filePath}: ${pattern}`)
    }
  }
}

if (violations.length > 0) {
  fs.writeFileSync(outputFile, violations.join('\n') + '\n', 'utf8')
  process.exit(1)
}

fs.writeFileSync(outputFile, '', 'utf8')
