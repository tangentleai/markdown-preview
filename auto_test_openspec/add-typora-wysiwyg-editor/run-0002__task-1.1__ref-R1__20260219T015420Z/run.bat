@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..\..\..") do set "REPO_ROOT=%%~fI"

pushd "%REPO_ROOT%"

echo [RUN] GUI scope detected: start-server-only
echo [URL] http://127.0.0.1:33100/
echo [INFO] Press Ctrl+C to stop the server.

call npm run dev -- --host 127.0.0.1 --port 33100

popd
endlocal
