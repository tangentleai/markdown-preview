@echo off
setlocal

set SCRIPT_DIR=%~dp0
for %%I in ("%SCRIPT_DIR%..\..\..") do set REPO_ROOT=%%~fI

cd /d "%REPO_ROOT%"

echo [RUN] MIXED scope bundle: start-server-only
echo [URL] http://127.0.0.1:33100/
echo [INFO] Run CLI checks separately: tests\test_cli_transaction_boundaries.bat
echo [INFO] Follow tests\gui_runbook_ime_undo_redo.md for MCP validation steps
echo [INFO] Press Ctrl+C to stop the server.

call npm run dev -- --host 127.0.0.1 --port 33100

endlocal
