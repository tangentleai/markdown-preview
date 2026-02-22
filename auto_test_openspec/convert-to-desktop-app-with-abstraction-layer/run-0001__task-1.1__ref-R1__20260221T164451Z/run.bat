@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "LOG_DIR=%SCRIPT_DIR%logs"
set "OUTPUT_DIR=%SCRIPT_DIR%outputs"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

echo [INFO] RUN #0001 task=1.1 ref=R1> "%LOG_DIR%\run.log"
echo [INFO] bundle_dir=%SCRIPT_DIR%>> "%LOG_DIR%\run.log"

call "%SCRIPT_DIR%tests\test_cli_core_boundary.bat" > "%OUTPUT_DIR%\test-output.txt" 2>&1
if errorlevel 1 exit /b %errorlevel%

exit /b 0
