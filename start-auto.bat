@echo off
echo.
echo ============================================================
echo 🚀 CURSOR Pipeline Demo - АВТОМАТИЧЕСКИЙ ЗАПУСК (Windows)
echo ============================================================
echo.

REM Проверка Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не найден! Установите Node.js 18+ с https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js найден
node --version

REM Установка зависимостей
echo.
echo 📦 Устанавливаем зависимости...
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Ошибка установки зависимостей
        pause
        exit /b 1
    )
    echo ✅ Зависимости установлены
) else (
    echo ✅ Зависимости уже установлены
)

REM Запуск автоматической настройки
echo.
echo 🚀 Запускаем автоматическую настройку...
node auto-setup.js

pause
