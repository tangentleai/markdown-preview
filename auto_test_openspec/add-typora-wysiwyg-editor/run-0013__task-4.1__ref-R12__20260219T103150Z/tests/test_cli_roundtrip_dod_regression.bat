@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "RUN_DIR=%SCRIPT_DIR%.."
set "REPO_ROOT=%SCRIPT_DIR%..\..\..\.."

if not exist "%RUN_DIR%\outputs" mkdir "%RUN_DIR%\outputs"

set "RAW_LOG=%RUN_DIR%\outputs\jest-dod-regression.log"
set "RAW_JSON=%RUN_DIR%\outputs\jest-dod-regression.json"
set "REPORT_TXT=%RUN_DIR%\outputs\dod-regression-report.txt"
set "SUMMARY_JSON=%RUN_DIR%\outputs\dod-regression-summary.json"

pushd "%REPO_ROOT%"
echo [CLI] Running task 4.1 DoD regression suite (round-trip + core interactions)

call npm test -- --runInBand src/__tests__/wysiwygDodRegression.test.tsx --json --outputFile "%RAW_JSON%" > "%RAW_LOG%" 2>&1
set "JEST_EXIT=%ERRORLEVEL%"

call node "%RUN_DIR%\tests\render_dod_report.mjs" "%RAW_JSON%" "%REPORT_TXT%" "%SUMMARY_JSON%" "%JEST_EXIT%"
if errorlevel 1 (
  popd
  exit /b 1
)

type "%REPORT_TXT%"
popd

if not "%JEST_EXIT%"=="0" exit /b %JEST_EXIT%
exit /b 0
