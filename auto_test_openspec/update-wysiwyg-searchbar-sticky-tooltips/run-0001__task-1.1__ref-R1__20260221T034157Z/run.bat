@echo off
setlocal

set SCRIPT_DIR=%~dp0
for %%I in ("%SCRIPT_DIR%..\..\..") do set REPO_ROOT=%%~fI

cd /d "%REPO_ROOT%"
echo [info] GUI scope bundle: start-server-only
echo [info] URL: http://127.0.0.1:33100/
call npm run dev -- --host 127.0.0.1 --port 33100
