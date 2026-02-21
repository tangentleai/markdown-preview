@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "RUN_LOG=%SCRIPT_DIR%logs\run.log"
set "OUTPUT_LOG=%SCRIPT_DIR%outputs\cli-math-performance.log"

if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"
if not exist "%SCRIPT_DIR%outputs" mkdir "%SCRIPT_DIR%outputs"

echo [run.bat] SCOPE=CLI > "%RUN_LOG%"
echo [run.bat] task=1.4 ref=R4 >> "%RUN_LOG%"

call "%SCRIPT_DIR%tests\test_cli_math_performance.bat" > "%OUTPUT_LOG%" 2>&1
set "EXIT_CODE=%ERRORLEVEL%"

type "%OUTPUT_LOG%"
echo [run.bat] exit_code=%EXIT_CODE%>> "%RUN_LOG%"

endlocal & exit /b %EXIT_CODE%
