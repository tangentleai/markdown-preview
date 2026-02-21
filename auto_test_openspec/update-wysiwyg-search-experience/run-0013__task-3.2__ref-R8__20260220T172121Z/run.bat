@echo off
setlocal

set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%\..\..\.."

echo [info] MIXED scope bundle: start-server-only for GUI verification
echo [info] URL: http://127.0.0.1:33100/
call npm run dev -- --host 127.0.0.1 --port 33100

popd
endlocal
