@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%\..\..\..\.." >nul

echo [test_cli_table_column_widths_r4.bat] running npm test -- wysiwygTableColumnWidths.test.ts
call npm test -- --runInBand src/__tests__/wysiwygTableColumnWidths.test.ts
set "EXIT_CODE=%ERRORLEVEL%"

popd >nul
endlocal & exit /b %EXIT_CODE%
