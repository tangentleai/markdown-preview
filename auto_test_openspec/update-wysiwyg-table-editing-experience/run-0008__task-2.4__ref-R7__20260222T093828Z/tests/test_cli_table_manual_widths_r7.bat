@echo off
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
for %%I in ("%SCRIPT_DIR%..") do set RUN_DIR=%%~fI
for %%I in ("%RUN_DIR%..\..\..") do set REPO_ROOT=%%~fI
set LOG_DIR=%RUN_DIR%\outputs

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
cd /d "%REPO_ROOT%"
echo [cli] Running manual column width state tests
npm test -- --runInBand src/__tests__/wysiwygTableManualColumnWidths.test.ts > "%LOG_DIR%\cli-table-manual-widths.log" 2>&1
type "%LOG_DIR%\cli-table-manual-widths.log"
