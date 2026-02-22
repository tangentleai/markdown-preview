@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "BUNDLE_DIR=%SCRIPT_DIR%.."
for %%I in ("%BUNDLE_DIR%") do set "BUNDLE_DIR=%%~fI"
for %%I in ("%BUNDLE_DIR%\..\..\..") do set "REPO_ROOT=%%~fI"
set "OUTPUT_DIR=%BUNDLE_DIR%\outputs"

if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

pushd "%REPO_ROOT%"

node "%SCRIPT_DIR%test_cli_core_platform_scan.cjs" "%REPO_ROOT%\src\core" "%OUTPUT_DIR%\core-platform-api-violations.txt"
if errorlevel 1 (
  echo [FAIL] found platform-specific APIs in src/core
  popd
  exit /b 1
)

npx tsc --noEmit --target ES2020 --module ESNext --moduleResolution bundler --lib ES2020,DOM --types jest src/core/index.ts src/__tests__/coreBoundaryContracts.test.ts > "%OUTPUT_DIR%\core-typecheck.log" 2>&1
if errorlevel 1 (
  popd
  exit /b %errorlevel%
)

npm run test -- --runInBand src/__tests__/coreBoundaryContracts.test.ts > "%OUTPUT_DIR%\core-contract-tests.log" 2>&1
if errorlevel 1 (
  popd
  exit /b %errorlevel%
)

popd
exit /b 0
