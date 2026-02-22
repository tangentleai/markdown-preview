@echo off
setlocal

pushd %~dp0

set "REPO_ROOT=%~dp0..\..\.."
for %%i in ("%REPO_ROOT%") do set "REPO_ROOT=%%~fi"

cd /d "%REPO_ROOT%"

echo Desktop dev server: http://localhost:33100/desktop.html

echo Starting desktop app (Electron + Vite dev server)...

call npm run desktop:dev

endlocal
EOF~