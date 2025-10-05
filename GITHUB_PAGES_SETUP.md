# ⚙️ Настройка GitHub Pages для ЗАДАЧНИК

## 🔧 Требуемые настройки репозитория

### 1️⃣ Включить GitHub Pages

1. Перейдите в настройки репозитория: https://github.com/jfsagro-glitch/zadachnik/settings/pages
2. В разделе **"Build and deployment"**:
   - **Source:** выберите **"GitHub Actions"**
   - ❌ НЕ выбирайте "Deploy from a branch"
3. Сохраните изменения

### 2️⃣ Проверить Permissions для GitHub Actions

1. Перейдите: https://github.com/jfsagro-glitch/zadachnik/settings/actions
2. В разделе **"Workflow permissions"**:
   - ✅ Выберите **"Read and write permissions"**
   - ✅ Отметьте галочку **"Allow GitHub Actions to create and approve pull requests"**
3. Нажмите **"Save"**

### 3️⃣ Проверить Actions

1. Перейдите: https://github.com/jfsagro-glitch/zadachnik/actions
2. Убедитесь, что workflow **"Deploy ЗАДАЧНИК to GitHub Pages"** запускается
3. Дождитесь завершения деплоя (зеленая галочка ✅)

## 🚀 Автоматический деплой

После правильной настройки:
- ✅ При каждом `git push` в ветку `main` автоматически запускается деплой
- ✅ Изменения появятся на https://jfsagro-glitch.github.io/zadachnik/ через 1-2 минуты
- ✅ Не требуется создавать ветку `gh-pages` вручную

## 📋 Текущая конфигурация

Workflow использует:
- `actions/checkout@v4` - загрузка кода
- `actions/configure-pages@v4` - настройка Pages
- `actions/upload-pages-artifact@v3` - загрузка артефактов
- `actions/deploy-pages@v4` - деплой на Pages

## 🔍 Проверка статуса деплоя

### Через GitHub Actions
1. https://github.com/jfsagro-glitch/zadachnik/actions
2. Найдите последний workflow run
3. Проверьте статус:
   - ✅ Зеленая галочка = успех
   - ❌ Красный крестик = ошибка
   - 🟡 Желтый кружок = в процессе

### Через командную строку
```bash
# Проверить последние коммиты
git log --oneline -5

# Проверить статус
git status

# Отправить изменения
git add .
git commit -m "update"
git push origin main
```

## ❗ Решение проблем

### Ошибка 403 Permission denied
**Причина:** Неправильные permissions для GitHub Actions

**Решение:**
1. Перейдите в Settings → Actions → General
2. Выберите "Read and write permissions"
3. Сохраните изменения
4. Сделайте новый commit для запуска workflow

### Ошибка: peaceiris/actions-gh-pages
**Причина:** Устаревший workflow файл

**Решение:**
- ✅ Удален `auto-deploy.yml` (использовал peaceiris/actions-gh-pages)
- ✅ Используется только `deploy.yml` (использует actions/deploy-pages)

### Изменения не отображаются
**Причина:** Кеш браузера

**Решение:** См. `CACHE_CLEAR.md`

## 📁 Структура деплоя

GitHub Pages разворачивает всё содержимое корня репозитория:
```
📁 zadachnik/
├── 📄 index.html          ← Главная страница
├── 📁 js/                 ← JavaScript файлы
│   ├── app.js
│   ├── data.js
│   ├── storage.js
│   ├── utils.js
│   └── charts.js
├── 📁 styles/             ← CSS стили
│   └── main.css
├── 📄 .nojekyll           ← Отключает Jekyll обработку
└── 📁 .github/
    └── 📁 workflows/
        └── deploy.yml     ← GitHub Actions workflow
```

## ✅ Результат

После правильной настройки:
- 🌐 Сайт доступен: https://jfsagro-glitch.github.io/zadachnik/
- 🔄 Автоматический деплой при каждом push
- 📊 Все файлы (HTML, CSS, JS) корректно загружаются
- 🎨 Стили и скрипты работают без ошибок

## 🔗 Полезные ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [actions/deploy-pages](https://github.com/actions/deploy-pages)
- [Repository Settings](https://github.com/jfsagro-glitch/zadachnik/settings)
- [Actions Workflows](https://github.com/jfsagro-glitch/zadachnik/actions)

---

**Дата создания:** 04.10.2025  
**Последнее обновление:** 04.10.2025


