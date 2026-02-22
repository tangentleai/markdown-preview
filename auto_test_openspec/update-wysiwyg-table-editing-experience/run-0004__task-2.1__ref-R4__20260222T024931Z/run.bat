@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "RUN_LOG=%SCRIPT_DIR%logs\run.log"
set "OUTPUT_LOG=%SCRIPT_DIR%outputs\cli-table-column-widths.log"

if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"
if not exist "%SCRIPT_DIR%outputs" mkdir "%SCRIPT_DIR%outputs"

echo [run.bat] SCOPE=CLI > "%RUN_LOG%"
echo [run.bat] task=2.1 ref=R4 >> "%RUN_LOG%"

call "%SCRIPT_DIR%tests\test_cli_table_column_widths_r4.bat" > "%OUTPUT_LOG%" 2>&1
set "EXIT_CODE=%ERRORLEVEL%"

type "%OUTPUT_LOG%"
findstr /C:"PASS" "%OUTPUT_LOG%" >nul
if errorlevel 1 (
  echo [run.bat] missing PASS in output >> "%RUN_LOG%"
  set "EXIT_CODE=1"
)
findstr /C:"FAIL" "%OUTPUT_LOG%" >nul
if not errorlevel 1 (
  echo [run.bat] detected FAIL in output >> "%RUN_LOG%"
  set "EXIT_CODE=1"
)

echo [run.bat] exit_code=%EXIT_CODE%>> "%RUN_LOG%"

endlocal & exit /b %EXIT_CODE%
