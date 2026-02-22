@echo off
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%\..\..\.."

echo [run.bat] GUI start-only for task 2.2 (R4 desktop shell)
echo [run.bat] Command: npm run desktop:dev
call npm run desktop:dev

popd
endlocal
