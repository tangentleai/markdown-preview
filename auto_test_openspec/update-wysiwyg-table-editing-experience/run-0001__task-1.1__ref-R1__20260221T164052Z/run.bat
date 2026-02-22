@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%\..\..\.."

echo [run.bat] Starting app server for GUI MCP validation
echo [run.bat] URL: http://127.0.0.1:33100/
call npm run dev -- --host 127.0.0.1 --port 33100

popd
endlocal
