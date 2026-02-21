@echo off
setlocal

set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%\..\..\..\.."

echo [cli] running R7 matcher engine tests
call npm test -- src/utils/findMatchEngine.test.ts
if errorlevel 1 (
  popd
  endlocal
  exit /b 1
)

popd
endlocal
