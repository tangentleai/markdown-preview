#!/bin/bash

# Markdown Preview Task 1.1 Validation Script

cd "$(dirname "$0")"
mkdir -p logs

echo "=== Task 1.1: 创建 React + TypeScript + Vite 项目基础结构 ==="

# Check project structure
echo "1. Checking project structure..."

required_files=(
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "index.html"
    "src/main.tsx"
    "src/App.tsx"
    "src/index.css"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ ! -f "../../../${file}" ]; then
        echo "❌ ERROR: File ${file} not found"
        all_files_exist=false
    else
        echo "✅ OK: File ${file} exists"
    fi
done

if [ "$all_files_exist" = false ]; then
    exit 1
fi

# Check node_modules
echo -e "\n2. Checking dependencies..."
if [ ! -d "../../../node_modules" ]; then
    echo "❌ ERROR: node_modules not found. Please run 'npm install' first."
    exit 1
fi
echo "✅ OK: node_modules exists"

# Check build process
echo -e "\n3. Building project..."
cd "../../.."
npm run build > auto_test_openspec/add-markdown-preview/run-0001__task-1.1__ref-R1__20260218T103000Z/logs/build.log 2>&1

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Build failed"
    echo "--- Build Output ---"
    cat auto_test_openspec/add-markdown-preview/run-0001__task-1.1__ref-R1__20260218T103000Z/logs/build.log
    exit 1
fi
echo "✅ OK: Build successful"

# Check dist directory
echo -e "\n4. Verifying build output..."
if [ ! -d "dist" ]; then
    echo "❌ ERROR: dist directory not created"
    exit 1
fi

dist_files=(
    "index.html"
    "assets"
)

all_dist_files_exist=true
for file in "${dist_files[@]}"; do
    if [ ! -e "dist/${file}" ]; then
        echo "❌ ERROR: dist/${file} not found"
        all_dist_files_exist=false
    else
        echo "✅ OK: dist/${file} exists"
    fi
done

if [ "$all_dist_files_exist" = false ]; then
    exit 1
fi

echo -e "\n=== All checks passed ==="
echo "✅ Project structure is valid"
echo "✅ Dependencies installed"
echo "✅ Build process successful"
echo "✅ Build output verified"

exit 0
