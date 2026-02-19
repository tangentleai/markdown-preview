@echo off
setlocal

set SCRIPT_DIR=%~dp0
for %%I in ("%SCRIPT_DIR%..\..\..") do set REPO_ROOT=%%~fI

cd /d "%REPO_ROOT%"

echo [RUN] GUI scope bundle: start-server-only
echo [URL] http://127.0.0.1:33100/
echo [INFO] Follow tests\gui_runbook_enter_backspace_rules.md for MCP validation steps
echo [INFO] Press Ctrl+C to stop the server.

call npm run dev -- --host 127.0.0.1 --port 33100

endlocal
