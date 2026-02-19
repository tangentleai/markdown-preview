@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "BUNDLE_DIR=%SCRIPT_DIR%.."
for %%I in ("%BUNDLE_DIR%") do set "BUNDLE_DIR=%%~fI"
for %%I in ("%BUNDLE_DIR%\..\..\..") do set "REPO_DIR=%%~fI"

echo [TEST] markdown import parser suite
echo [TEST] repo_dir=%REPO_DIR%

pushd "%REPO_DIR%"
call npm test -- markdownDocumentModel
set "ERR=%ERRORLEVEL%"
popd

exit /b %ERR%
