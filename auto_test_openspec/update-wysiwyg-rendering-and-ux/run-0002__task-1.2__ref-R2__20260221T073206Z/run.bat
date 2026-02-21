@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%\..\..\.." >nul

set "PORT=33100"
set "URL=http://127.0.0.1:%PORT%/"

echo [run.bat] Starting dev server for GUI MCP validation only
echo [run.bat] URL: %URL%
call npm run dev -- --host 127.0.0.1 --port %PORT%

popd >nul
endlocal
