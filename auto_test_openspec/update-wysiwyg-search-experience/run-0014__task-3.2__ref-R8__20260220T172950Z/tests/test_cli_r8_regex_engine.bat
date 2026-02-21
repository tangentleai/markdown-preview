@echo off
setlocal

set SCRIPT_DIR=%~dp0
set RUN_DIR=%SCRIPT_DIR%\..
set REPO_ROOT=%SCRIPT_DIR%\..\..\..\..

if not exist "%RUN_DIR%\outputs" mkdir "%RUN_DIR%\outputs"

pushd "%REPO_ROOT%"
echo [cli] running R8 regex matcher tests
call npm test -- src/utils/findMatchEngine.test.ts > "%RUN_DIR%\outputs\cli_test_output.txt"
type "%RUN_DIR%\outputs\cli_test_output.txt"
popd

endlocal
