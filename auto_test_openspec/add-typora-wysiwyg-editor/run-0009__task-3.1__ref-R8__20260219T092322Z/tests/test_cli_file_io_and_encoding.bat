@echo off
setlocal

set SCRIPT_DIR=%~dp0
for %%I in ("%SCRIPT_DIR%..") do set RUN_DIR=%%~fI
for %%I in ("%SCRIPT_DIR%..\..\..\..") do set REPO_ROOT=%%~fI
set OUTPUT_FILE=%RUN_DIR%\outputs\cli-file-io-and-encoding.txt

if not exist "%RUN_DIR%\outputs" mkdir "%RUN_DIR%\outputs"

cd /d "%REPO_ROOT%"

echo [CLI] Running file I/O and save-flow checks for task 3.1 (R8)
call npm test -- --runInBand src/__tests__/markdownFileIO.test.ts src/__tests__/App.test.tsx > "%OUTPUT_FILE%" 2>&1
type "%OUTPUT_FILE%"
if errorlevel 1 exit /b 1

endlocal
