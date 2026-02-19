import fs from 'node:fs'

const [rawJsonPath, reportTxtPath, summaryJsonPath, jestExitInput] = process.argv.slice(2)

if (!rawJsonPath || !reportTxtPath || !summaryJsonPath || typeof jestExitInput === 'undefined') {
  console.error('Usage: node render_dod_report.mjs <raw-json> <report-txt> <summary-json> <jest-exit>')
  process.exit(1)
}

const jestExitCode = Number.parseInt(jestExitInput, 10)

const fallbackSummary = {
  jestExitCode,
  total: 0,
  passed: 0,
  failed: 0,
  passRate: '0.00',
  failures: ['Jest result JSON is missing; cannot build detailed failure list.']
}

let summary = fallbackSummary

if (fs.existsSync(rawJsonPath)) {
  const raw = JSON.parse(fs.readFileSync(rawJsonPath, 'utf8'))
  const total = Number(raw.numTotalTests ?? 0)
  const passed = Number(raw.numPassedTests ?? 0)
  const failed = Number(raw.numFailedTests ?? 0)

  const failureDetails = []
  const testResults = Array.isArray(raw.testResults) ? raw.testResults : []
  for (const suite of testResults) {
    const assertions = Array.isArray(suite.assertionResults) ? suite.assertionResults : []
    for (const assertion of assertions) {
      if (assertion.status !== 'failed') {
        continue
      }
      const firstFailure = Array.isArray(assertion.failureMessages) && assertion.failureMessages.length > 0
        ? assertion.failureMessages[0].split('\n').slice(0, 4).join(' | ').replace(/\u001b\[[0-9;]*m/g, '')
        : 'No failure message provided by Jest.'
      failureDetails.push(`${assertion.fullName} :: ${firstFailure}`)
    }
  }

  summary = {
    jestExitCode,
    total,
    passed,
    failed,
    passRate: total === 0 ? '0.00' : ((passed / total) * 100).toFixed(2),
    failures: failureDetails
  }
}

const reportLines = [
  'DoD Regression Report (Task 4.1 / R12)',
  `Jest exit code: ${summary.jestExitCode}`,
  `Total scenarios: ${summary.total}`,
  `Passed: ${summary.passed}`,
  `Failed: ${summary.failed}`,
  `Pass rate: ${summary.passRate}%`,
  ''
]

if (summary.failures.length === 0) {
  reportLines.push('Failure details: none')
} else {
  reportLines.push('Failure details:')
  for (const detail of summary.failures) {
    reportLines.push(`- ${detail}`)
  }
}

fs.writeFileSync(reportTxtPath, `${reportLines.join('\n')}\n`)
fs.writeFileSync(summaryJsonPath, `${JSON.stringify(summary, null, 2)}\n`)
