@echo off

REM 优化 WYSIWYG 编辑模式下的编辑区内容滑动显示体验 - 验收脚本

echo === 优化 WYSIWYG 编辑模式下的编辑区内容滑动显示体验 ===
echo 正在启动验收流程...

REM 检查是否安装了 Node.js 和 npm
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 Node.js，请先安装 Node.js
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 npm，请先安装 npm
    exit /b 1
)

REM 检查项目根目录
if not exist "package.json" (
    echo ❌ 错误：请在项目根目录运行此脚本
    exit /b 1
)

echo ✅ 项目依赖检查通过

REM 安装依赖
echo 正在安装项目依赖...
npm install

if %errorlevel% neq 0 (
    echo ❌ 错误：依赖安装失败
    exit /b 1
)

echo ✅ 项目依赖安装完成

REM 运行测试
echo 正在运行测试...
npm run test

if %errorlevel% neq 0 (
    echo ❌ 错误：测试失败
    exit /b 1
)

echo ✅ 所有测试通过

REM 启动开发服务器
echo 正在启动开发服务器...
echo 请在浏览器中访问 http://localhost:5173 进行手动验收
npm run dev

