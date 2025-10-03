/**
 * Демо-данные для ЗАДАЧНИК
 */

const DemoData = {
    // Демо-пользователи
    users: [
        {
            id: 'user_1',
            name: 'Анна Иванова',
            role: 'supervisor',
            department: 'IT отдел',
            email: 'anna.ivanova@company.com',
            avatar: '👩‍💼',
            createdAt: Date.now() - 86400000 * 30,
            isActive: true
        },
        {
            id: 'user_2',
            name: 'Михаил Петров',
            role: 'executor',
            department: 'IT отдел',
            email: 'mikhail.petrov@company.com',
            avatar: '👨‍💻',
            createdAt: Date.now() - 86400000 * 25,
            isActive: true
        },
        {
            id: 'user_3',
            name: 'Елена Сидорова',
            role: 'executor',
            department: 'IT отдел',
            email: 'elena.sidorova@company.com',
            avatar: '👩‍💻',
            createdAt: Date.now() - 86400000 * 20,
            isActive: true
        },
        {
            id: 'user_4',
            name: 'Дмитрий Козлов',
            role: 'manager',
            department: 'IT отдел',
            email: 'dmitry.kozlov@company.com',
            avatar: '👨‍💼',
            createdAt: Date.now() - 86400000 * 35,
            isActive: true
        },
        {
            id: 'user_5',
            name: 'Ольга Новикова',
            role: 'executor',
            department: 'HR отдел',
            email: 'olga.novikova@company.com',
            avatar: '👩‍🎓',
            createdAt: Date.now() - 86400000 * 15,
            isActive: true
        },
        {
            id: 'user_6',
            name: 'Сергей Волков',
            role: 'executor',
            department: 'Маркетинг',
            email: 'sergey.volkov@company.com',
            avatar: '👨‍🎨',
            createdAt: Date.now() - 86400000 * 10,
            isActive: true
        },
        {
            id: 'user_7',
            name: 'Татьяна Морозова',
            role: 'executor',
            department: 'Маркетинг',
            email: 'tatyana.morozova@company.com',
            avatar: '👩‍🎨',
            createdAt: Date.now() - 86400000 * 8,
            isActive: true
        },
        {
            id: 'user_8',
            name: 'Александр Соколов',
            role: 'business',
            department: 'Маркетинг',
            email: 'alexander.sokolov@company.com',
            avatar: '👨‍💼',
            createdAt: Date.now() - 86400000 * 12,
            isActive: true
        }
    ],
    
    // Демо-задачи
    tasks: [
        {
            id: 'task_1',
            title: 'Разработка нового API',
            description: 'Создать REST API для мобильного приложения с поддержкой аутентификации и авторизации пользователей. API должен поддерживать CRUD операции для основных сущностей системы.',
            priority: 'high',
            assignee: 'Михаил Петров',
            deadline: getDateString(7),
            tags: ['разработка', 'API', 'backend', 'аутентификация'],
            status: 'in-progress',
            createdAt: Date.now() - 86400000 * 5,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: 'task_2',
            title: 'Дизайн главной страницы',
            description: 'Создать современный адаптивный дизайн главной страницы сайта с учетом UX/UI принципов и брендинга компании.',
            priority: 'medium',
            assignee: 'Елена Сидорова',
            deadline: getDateString(5),
            tags: ['дизайн', 'frontend', 'UI', 'UX'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 3,
            updatedAt: Date.now() - 86400000 * 3
        },
        {
            id: 'task_3',
            title: 'Настройка CI/CD',
            description: 'Настроить автоматическое развертывание и тестирование приложения с использованием GitHub Actions и Docker.',
            priority: 'high',
            assignee: 'Анна Иванова',
            deadline: getDateString(10),
            tags: ['DevOps', 'CI/CD', 'автоматизация', 'Docker'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 7,
            updatedAt: Date.now() - 86400000 * 7
        },
        {
            id: 'task_4',
            title: 'Рекрутинг разработчиков',
            description: 'Поиск и проведение собеседований с кандидатами на позицию Frontend разработчика. Анализ резюме и техническое интервью.',
            priority: 'medium',
            assignee: 'Ольга Новикова',
            deadline: getDateString(14),
            tags: ['HR', 'рекрутинг', 'собеседования', 'разработчики'],
            status: 'in-progress',
            createdAt: Date.now() - 86400000 * 10,
            updatedAt: Date.now() - 86400000 * 2
        },
        {
            id: 'task_5',
            title: 'Маркетинговая кампания',
            description: 'Запуск рекламной кампании в социальных сетях для продвижения нового продукта. Создание креативов и настройка таргетинга.',
            priority: 'medium',
            assignee: 'Сергей Волков',
            deadline: getDateString(3),
            tags: ['маркетинг', 'SMM', 'реклама', 'социальные сети'],
            status: 'review',
            createdAt: Date.now() - 86400000 * 8,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: 'task_6',
            title: 'Тестирование мобильного приложения',
            description: 'Провести полное тестирование всех функций мобильного приложения на разных устройствах и операционных системах.',
            priority: 'high',
            assignee: 'Елена Сидорова',
            deadline: getDateString(-2),
            tags: ['тестирование', 'QA', 'мобильное приложение', 'кроссплатформенность'],
            status: 'done',
            createdAt: Date.now() - 86400000 * 15,
            updatedAt: Date.now() - 86400000 * 2
        },
        {
            id: 'task_7',
            title: 'Обновление базы данных',
            description: 'Миграция данных и оптимизация производительности базы данных. Создание резервных копий и тестирование.',
            priority: 'critical',
            assignee: 'Михаил Петров',
            deadline: getDateString(1),
            tags: ['база данных', 'миграция', 'оптимизация', 'резервное копирование'],
            status: 'in-progress',
            createdAt: Date.now() - 86400000 * 12,
            updatedAt: Date.now() - 86400000 * 0
        },
        {
            id: 'task_8',
            title: 'Создание документации API',
            description: 'Написание подробной документации для разработчиков по использованию API. Примеры кода и схемы данных.',
            priority: 'medium',
            assignee: 'Анна Иванова',
            deadline: getDateString(8),
            tags: ['документация', 'API', 'разработка', 'примеры'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 6,
            updatedAt: Date.now() - 86400000 * 6
        },
        {
            id: 'task_9',
            title: 'Анализ конкурентов',
            description: 'Исследование рынка и анализ продуктов конкурентов. Подготовка отчета с рекомендациями по улучшению продукта.',
            priority: 'low',
            assignee: 'Александр Соколов',
            deadline: getDateString(20),
            tags: ['анализ', 'исследования', 'конкуренты', 'отчет'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 4,
            updatedAt: Date.now() - 86400000 * 4
        },
        {
            id: 'task_10',
            title: 'Интеграция с платежной системой',
            description: 'Подключение и настройка обработки платежей через популярные платежные системы. Тестирование безопасности.',
            priority: 'high',
            assignee: 'Михаил Петров',
            deadline: getDateString(12),
            tags: ['интеграция', 'платежи', 'безопасность', 'тестирование'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 9,
            updatedAt: Date.now() - 86400000 * 9
        },
        {
            id: 'task_11',
            title: 'Оптимизация производительности',
            description: 'Анализ и оптимизация производительности веб-приложения. Уменьшение времени загрузки и улучшение UX.',
            priority: 'medium',
            assignee: 'Елена Сидорова',
            deadline: getDateString(15),
            tags: ['оптимизация', 'производительность', 'UX', 'скорость'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 11,
            updatedAt: Date.now() - 86400000 * 11
        },
        {
            id: 'task_12',
            title: 'Создание обучающих материалов',
            description: 'Разработка обучающих материалов для новых сотрудников. Видеоуроки и интерактивные туториалы.',
            priority: 'low',
            assignee: 'Татьяна Морозова',
            deadline: getDateString(25),
            tags: ['обучение', 'документация', 'видео', 'туториалы'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 13,
            updatedAt: Date.now() - 86400000 * 13
        },
        {
            id: 'task_13',
            title: 'Настройка мониторинга',
            description: 'Внедрение системы мониторинга приложения и настройка алертов для критических событий.',
            priority: 'medium',
            assignee: 'Дмитрий Козлов',
            deadline: getDateString(6),
            tags: ['мониторинг', 'алерты', 'DevOps', 'наблюдаемость'],
            status: 'in-progress',
            createdAt: Date.now() - 86400000 * 14,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: 'task_14',
            title: 'Создание email-рассылок',
            description: 'Настройка автоматических email-рассылок для пользователей. Шаблоны и персонализация контента.',
            priority: 'low',
            assignee: 'Татьяна Морозова',
            deadline: getDateString(18),
            tags: ['email', 'рассылки', 'автоматизация', 'маркетинг'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 16,
            updatedAt: Date.now() - 86400000 * 16
        },
        {
            id: 'task_15',
            title: 'Тестирование безопасности',
            description: 'Проведение тестирования безопасности приложения и исправление найденных уязвимостей.',
            priority: 'critical',
            assignee: 'Михаил Петров',
            deadline: getDateString(4),
            tags: ['безопасность', 'тестирование', 'уязвимости', 'защита'],
            status: 'review',
            createdAt: Date.now() - 86400000 * 17,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: 'task_16',
            title: 'Оптимизация базы данных',
            description: 'Оптимизация запросов и индексов для улучшения производительности.',
            priority: 'high',
            assignee: 'Елена Сидорова',
            deadline: getDateString(6),
            tags: ['база данных', 'оптимизация', 'производительность'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 2,
            updatedAt: Date.now() - 86400000 * 2
        },
        {
            id: 'task_17',
            title: 'Документация API',
            description: 'Создание подробной документации для всех API endpoints.',
            priority: 'medium',
            assignee: 'Дмитрий Козлов',
            deadline: getDateString(8),
            tags: ['документация', 'API', 'техписатель'],
            status: 'in-progress',
            createdAt: Date.now() - 86400000 * 3,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: 'task_18',
            title: 'Мониторинг системы',
            description: 'Настройка системы мониторинга и алертов для отслеживания состояния серверов.',
            priority: 'high',
            assignee: 'Ольга Новикова',
            deadline: getDateString(5),
            tags: ['мониторинг', 'алерты', 'серверы', 'наблюдение'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 1,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: 'task_19',
            title: 'Резервное копирование',
            description: 'Настройка автоматического резервного копирования данных.',
            priority: 'critical',
            assignee: 'Михаил Петров',
            deadline: getDateString(3),
            tags: ['резервное копирование', 'безопасность', 'данные'],
            status: 'in-progress',
            createdAt: Date.now() - 86400000 * 4,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: 'task_20',
            title: 'Интеграция с CRM',
            description: 'Интеграция системы с CRM для синхронизации данных клиентов.',
            priority: 'medium',
            assignee: 'Елена Сидорова',
            deadline: getDateString(10),
            tags: ['интеграция', 'CRM', 'клиенты', 'синхронизация'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 2,
            updatedAt: Date.now() - 86400000 * 2
        },
        {
            id: 'task_21',
            title: 'Обновление зависимостей',
            description: 'Обновление всех библиотек и зависимостей до последних версий.',
            priority: 'medium',
            assignee: 'Дмитрий Козлов',
            deadline: getDateString(7),
            tags: ['обновления', 'зависимости', 'библиотеки', 'безопасность'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 3,
            updatedAt: Date.now() - 86400000 * 3
        },
        {
            id: 'task_22',
            title: 'Настройка CI/CD',
            description: 'Настройка автоматической сборки и развертывания приложения.',
            priority: 'high',
            assignee: 'Ольга Новикова',
            deadline: getDateString(9),
            tags: ['CI/CD', 'автоматизация', 'развертывание', 'сборка'],
            status: 'in-progress',
            createdAt: Date.now() - 86400000 * 5,
            updatedAt: Date.now() - 86400000 * 2
        },
        {
            id: 'task_23',
            title: 'Аудит кода',
            description: 'Проведение аудита кода для выявления проблем и улучшения качества.',
            priority: 'medium',
            assignee: 'Анна Иванова',
            deadline: getDateString(12),
            tags: ['аудит', 'качество кода', 'рефакторинг', 'лучшие практики'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 4,
            updatedAt: Date.now() - 86400000 * 4
        },
        {
            id: 'task_24',
            title: 'Тестирование нагрузки',
            description: 'Проведение нагрузочного тестирования для проверки стабильности системы.',
            priority: 'high',
            assignee: 'Михаил Петров',
            deadline: getDateString(6),
            tags: ['нагрузочное тестирование', 'производительность', 'стабильность'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 1,
            updatedAt: Date.now() - 86400000 * 1
        },
        {
            id: 'task_25',
            title: 'Миграция данных',
            description: 'Миграция данных из старой системы в новую с сохранением целостности.',
            priority: 'critical',
            assignee: 'Елена Сидорова',
            deadline: getDateString(14),
            tags: ['миграция', 'данные', 'целостность', 'перенос'],
            status: 'new',
            createdAt: Date.now() - 86400000 * 6,
            updatedAt: Date.now() - 86400000 * 6
        }
    ],
    
    // Настройки по умолчанию
    settings: {
        theme: 'light',
        language: 'ru',
        notifications: true,
        autoSave: true,
        defaultPriority: 'medium',
        defaultDeadlineDays: 7,
        showCompletedTasks: true,
        compactView: false
    }
};

// Функция для получения даты
function getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

// Экспорт для использования в других модулях
window.DemoData = DemoData;
