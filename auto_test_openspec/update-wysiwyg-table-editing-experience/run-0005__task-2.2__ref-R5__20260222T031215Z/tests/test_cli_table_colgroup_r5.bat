@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "RUN_DIR=%SCRIPT_DIR%.."
if not exist "%RUN_DIR%\outputs" mkdir "%RUN_DIR%\outputs"

pushd "%SCRIPT_DIR%\..\..\..\.." >nul

echo [test_cli_table_colgroup_r5.bat] running npm test -- wysiwygTableColgroup.test.ts
call npm test -- --runInBand src/__tests__/wysiwygTableColgroup.test.ts > "%RUN_DIR%\outputs\cli-table-colgroup.log" 2>&1
set "EXIT_CODE=%ERRORLEVEL%"

popd >nul
endlocal & exit /b %EXIT_CODE%
