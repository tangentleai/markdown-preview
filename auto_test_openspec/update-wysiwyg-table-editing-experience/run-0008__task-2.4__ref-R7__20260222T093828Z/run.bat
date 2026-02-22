@echo off
setlocal

set SCRIPT_DIR=%~dp0
for %%I in ("%SCRIPT_DIR%..\..\..") do set REPO_ROOT=%%~fI

cd /d "%REPO_ROOT%"
echo [run.bat] Starting app server for MIXED GUI MCP validation
echo [run.bat] URL: http://127.0.0.1:33100/
npm run dev -- --host 127.0.0.1 --port 33100
