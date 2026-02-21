@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "RUN_DIR=%SCRIPT_DIR%.."
set "REPO_ROOT=%RUN_DIR%\..\..\.."
set "LOG_FILE=%RUN_DIR%\outputs\cli-hr-rendering.log"

if not exist "%RUN_DIR%\outputs" mkdir "%RUN_DIR%\outputs"

pushd "%REPO_ROOT%"
echo [cli] Running horizontal-rule rendering assertions > "%LOG_FILE%"
call npm test -- markdownDocumentModel.test.ts wysiwygBlockInputRules.test.ts >> "%LOG_FILE%" 2>&1
set "EXIT_CODE=%ERRORLEVEL%"
popd

type "%LOG_FILE%"
exit /b %EXIT_CODE%
