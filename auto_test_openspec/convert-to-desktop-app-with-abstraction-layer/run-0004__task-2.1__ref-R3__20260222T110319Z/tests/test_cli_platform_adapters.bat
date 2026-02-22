@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..") do set "RUN_DIR=%%~fI"
for %%I in ("%RUN_DIR%\..\..") do set "REPO_ROOT=%%~fI"
set "LOG_DIR=%RUN_DIR%\logs"
set "OUTPUT_DIR=%RUN_DIR%\outputs"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

echo [INFO] adapter CLI validation> "%LOG_DIR%\cli-run.log"
echo [INFO] repo_root=%REPO_ROOT%>> "%LOG_DIR%\cli-run.log"

cd /d "%REPO_ROOT%"

echo [STEP] TypeScript typecheck (adapter scope)>> "%LOG_DIR%\cli-run.log"
call npx tsc --noEmit -p "%SCRIPT_DIR%tsconfig.adapters.json" > "%OUTPUT_DIR%\typecheck.log" 2>&1
if errorlevel 1 exit /b %errorlevel%

echo [STEP] Adapter contract tests>> "%LOG_DIR%\cli-run.log"
call npm run test -- --runInBand src/__tests__\adapterContracts.test.ts > "%OUTPUT_DIR%\adapter-contract-tests.log" 2>&1
if errorlevel 1 exit /b %errorlevel%

echo [STEP] Core contract tests (reused)>> "%LOG_DIR%\cli-run.log"
call npm run test -- --runInBand src/__tests__\coreBoundaryContracts.test.ts src/__tests__\coreSharedLogicMigration.test.ts > "%OUTPUT_DIR%\core-contract-tests.log" 2>&1
if errorlevel 1 exit /b %errorlevel%

exit /b 0
