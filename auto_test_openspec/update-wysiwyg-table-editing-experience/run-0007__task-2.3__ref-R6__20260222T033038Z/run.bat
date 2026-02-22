@echo off
setlocal

set "PORT=33100"
set "URL=http://127.0.0.1:%PORT%/"

pushd "%~dp0\..\..\.." >nul

echo [run.bat] Starting dev server for MIXED GUI validation startup only

echo [run.bat] URL: %URL%
call npm run dev -- --host 127.0.0.1 --port %PORT%

popd >nul
endlocal
