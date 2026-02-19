@echo off
setlocal

set SCRIPT_DIR=%~dp0
for %%I in ("%SCRIPT_DIR%..") do set BUNDLE_DIR=%%~fI
for %%I in ("%BUNDLE_DIR%..\..\..") do set REPO_DIR=%%~fI

echo [TEST] inline style rules + mixed regression
echo [TEST] repo_dir=%REPO_DIR%

cd /d "%REPO_DIR%"
call npm test -- wysiwygInlineStyleRules App wysiwygBlockInputRules markdownDocumentModel

endlocal
