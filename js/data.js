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
            status: 'review',
            createdAt: Date.now() - 86400000 * 17,
            updatedAt: Date.now() - 86400000 * 1
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
