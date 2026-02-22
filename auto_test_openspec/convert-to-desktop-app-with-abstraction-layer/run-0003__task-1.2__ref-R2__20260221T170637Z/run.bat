@echo off
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%\..\..\.."

echo [run.bat] GUI start-only for task 1.2 (R2 unblock bundle)
echo [run.bat] URL: http://127.0.0.1:33100/
echo [run.bat] Preflight: close stale MCP/Chrome session before GUI runbook
call npm run dev

popd
endlocal
