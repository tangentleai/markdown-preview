@echo off
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set RUN_DIR=%SCRIPT_DIR%\..

pushd "%SCRIPT_DIR%\..\..\..\.."

set LOG_FILE=%RUN_DIR%\logs\cli_test.log
echo [cli] running targeted core migration tests > "%LOG_FILE%"
call npm run test -- --runInBand src/__tests__/coreBoundaryContracts.test.ts src/__tests__/coreSharedLogicMigration.test.ts src/__tests__/markdownDocumentModel.test.ts src/utils/findMatchEngine.test.ts src/__tests__/markdownFileIO.test.ts >> "%LOG_FILE%" 2>&1
set EXIT_CODE=%ERRORLEVEL%

popd
exit /b %EXIT_CODE%
