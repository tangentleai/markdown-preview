@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%\..\..\..\.." >nul

echo [test_cli_math_performance.bat] running npm test -- mathRenderingPerformance.test.ts
call npm test -- mathRenderingPerformance.test.ts
set "EXIT_CODE=%ERRORLEVEL%"

popd >nul
endlocal & exit /b %EXIT_CODE%
