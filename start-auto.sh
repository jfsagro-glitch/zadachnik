#!/bin/bash

echo ""
echo "============================================================"
echo "🚀 CURSOR Pipeline Demo - АВТОМАТИЧЕСКИЙ ЗАПУСК (Linux/Mac)"
echo "============================================================"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден! Установите Node.js 18+ с https://nodejs.org"
    exit 1
fi

echo "✅ Node.js найден"
node --version

# Установка зависимостей
echo ""
echo "📦 Устанавливаем зависимости..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка установки зависимостей"
        exit 1
    fi
    echo "✅ Зависимости установлены"
else
    echo "✅ Зависимости уже установлены"
fi

# Запуск автоматической настройки
echo ""
echo "🚀 Запускаем автоматическую настройку..."
node auto-setup.js
