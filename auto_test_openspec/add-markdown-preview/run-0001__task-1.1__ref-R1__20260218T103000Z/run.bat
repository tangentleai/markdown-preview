@echo off
setlocal enabledelayedexpansion

REM Markdown Preview Task 1.1 Validation Script
REM Verify React + TypeScript + Vite project structure

cd /d "%~dp0"

if not exist "logs" mkdir logs

REM Function to log messages
echo [%date% %time%] Starting Task 1.1 validation >> logs\validation.log

echo Checking project structure...
echo [%date% %time%] Checking project structure... >> logs\validation.log

REM List of required files
set "required_files=package.json tsconfig.json vite.config.ts index.html src\main.tsx src\App.tsx src\index.css"

for %%f in (%required_files%) do (
    if not exist "..\..\..\%%f" (
        echo Error: File %%f not found
        echo [%date% %time%] ERROR: File %%f not found >> logs\validation.log
        exit /b 1
    )
    echo OK: File %%f exists
    echo [%date% %time%] OK: File %%f exists >> logs\validation.log
)

if not exist "..\..\..\node_modules" (
    echo Error: node_modules directory not found. Please run npm install first.
    echo [%date% %time%] ERROR: node_modules directory not found. Please run npm install first. >> logs\validation.log
    exit /b 1
)
echo OK: node_modules directory exists
echo [%date% %time%] OK: node_modules directory exists >> logs\validation.log

echo Running build process...
echo [%date% %time%] Running build process... >> logs\validation.log
cd /d "..\..\.." && npm run build > auto_test_openspec\add-markdown-preview\run-0001__task-1.1__ref-R1__20260218T103000Z\logs\build.log 2>&1

if !errorlevel! neq 0 (
    echo Error: npm run build failed
    echo [%date% %time%] ERROR: npm run build failed >> logs\validation.log
    exit /b 1
)
echo OK: npm run build successful
echo [%date% %time%] OK: npm run build successful >> logs\validation.log

if not exist "dist" (
    echo Error: dist directory not created
    echo [%date% %time%] ERROR: dist directory not created >> logs\validation.log
    exit /b 1
)

echo Checking dist directory contents...
echo [%date% %time%] Checking dist directory contents... >> logs\validation.log

set "dist_files=dist\index.html dist\assets"

for %%f in (%dist_files%) do (
    if not exist "%%f" (
        echo Error: %%f not found
        echo [%date% %time%] ERROR: %%f not found >> logs\validation.log
        exit /b 1
    )
    echo OK: %%f exists
    echo [%date% %time%] OK: %%f exists >> logs\validation.log
)

echo Validation completed successfully
echo [%date% %time%] Validation completed successfully >> logs\validation.log

endlocal
exit /b 0
