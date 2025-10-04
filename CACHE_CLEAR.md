# 🔄 Инструкция по очистке кеша браузера для GitHub Pages

## ⚠️ Если изменения не отображаются на сайте

GitHub Pages и браузеры кешируют статические файлы. Если вы не видите последние изменения на https://jfsagro-glitch.github.io/zadachnik/, выполните следующие действия:

---

## 🌐 Способ 1: Жесткая перезагрузка страницы

### Windows / Linux:
- **Chrome / Edge / Firefox**: `Ctrl + Shift + R` или `Ctrl + F5`

### macOS:
- **Chrome / Edge**: `Cmd + Shift + R`
- **Safari**: `Cmd + Option + R`

---

## 🗑️ Способ 2: Очистка кеша браузера

### Google Chrome / Microsoft Edge:
1. Нажмите `Ctrl + Shift + Delete` (Windows) или `Cmd + Shift + Delete` (Mac)
2. Выберите период: **Все время**
3. Отметьте:
   - ✅ Изображения и другие файлы, сохраненные в кеше
   - ✅ Файлы cookie и другие данные сайтов
4. Нажмите **Удалить данные**

### Mozilla Firefox:
1. Нажмите `Ctrl + Shift + Delete` (Windows) или `Cmd + Shift + Delete` (Mac)
2. Выберите период: **Все**
3. Отметьте:
   - ✅ Кэш
   - ✅ Куки
4. Нажмите **Удалить сейчас**

---

## 🕵️ Способ 3: Режим инкогнито

Откройте сайт в режиме инкогнито/приватном режиме:

- **Chrome / Edge**: `Ctrl + Shift + N` (Windows) или `Cmd + Shift + N` (Mac)
- **Firefox**: `Ctrl + Shift + P` (Windows) или `Cmd + Shift + P` (Mac)

Перейдите на: https://jfsagro-glitch.github.io/zadachnik/

---

## 🔧 Способ 4: Добавить параметр к URL

Добавьте случайный параметр к URL для обхода кеша:

```
https://jfsagro-glitch.github.io/zadachnik/?v=2
https://jfsagro-glitch.github.io/zadachnik/?nocache=true
https://jfsagro-glitch.github.io/zadachnik/?timestamp=202510041500
```

---

## 🚀 Способ 5: Проверить статус GitHub Actions

1. Перейдите на: https://github.com/jfsagro-glitch/zadachnik/actions
2. Убедитесь, что последний workflow **Deploy ЗАДАЧНИК to GitHub Pages** завершился успешно (зеленая галочка ✅)
3. Подождите 1-2 минуты после успешного деплоя
4. Очистите кеш браузера и обновите страницу

---

## ⏱️ Сколько ждать обновления?

- **GitHub Actions**: ~30 секунд - 2 минуты
- **CDN GitHub Pages**: 2-10 минут
- **Кеш браузера**: очищается вручную

---

## ✅ Последние изменения

### Коммит: `255f60f` - trigger: принудительный деплой на GitHub Pages
**Что исправлено:**
- ✅ Убраны теги из всех демо-задач (15 задач)
- ✅ Удалены поля тегов из форм
- ✅ Обновлен Kanban без тегов
- ✅ Исправлен GitHub Actions workflow
- ✅ Добавлен .nojekyll

---

## 🆘 Если ничего не помогло

Напишите issue на GitHub: https://github.com/jfsagro-glitch/zadachnik/issues

Укажите:
- Браузер и версию
- Скриншот проблемы
- Результат открытия в режиме инкогнито

