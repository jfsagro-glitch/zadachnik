/**
 * Демо-данные для ЗАДАЧНИК - Компактная табличная система
 */

const DemoData = {
    // Пользователи
    users: [
        { id: 'U1', name: 'Иван Петров', role: 'executor', available: false },
        { id: 'U2', name: 'Елена Коваль', role: 'executor', available: true },
        { id: 'U3', name: 'Анна Смирнова', role: 'executor', available: false },
        { id: 'U4', name: 'Дмитрий Волков', role: 'executor', available: true },
        { id: 'U5', name: 'Мария Новикова', role: 'executor', available: false },
        { id: 'U6', name: 'Сергей Морозов', role: 'executor', available: true },
        { id: 'U7', name: 'Ольга Соколова', role: 'executor', available: false },
        { id: 'U8', name: 'Алексей Кузнецов', role: 'executor', available: true },
        { id: 'U9', name: 'Татьяна Лебедева', role: 'executor', available: false },
        { id: 'U10', name: 'Павел Орлов', role: 'executor', available: true }
    ],
    
    // Задачи (20+)
    tasks: [
        {
            id: 'T-001',
            title: 'Разработка ТЗ проекта корпоративного портала',
            status: 'in-progress',
            priority: 'high',
            assignee: 'Иван Петров',
            deadline: getDateString(5),
            workload: 65
        },
        {
            id: 'T-002',
            title: 'Подбор фронтенд-разработчика React',
            status: 'new',
            priority: 'medium',
            assignee: 'Елена Коваль',
            deadline: getDateString(10),
            workload: 40
        },
        {
            id: 'T-003',
            title: 'Дизайн лендинга для нового продукта',
            status: 'done',
            priority: 'low',
            assignee: 'Анна Смирнова',
            deadline: getDateString(-3),
            workload: 100
        },
        {
            id: 'T-004',
            title: 'Настройка CI/CD pipeline для микросервисов',
            status: 'in-progress',
            priority: 'critical',
            assignee: 'Дмитрий Волков',
            deadline: getDateString(2),
            workload: 85
        },
        {
            id: 'T-005',
            title: 'Тестирование мобильного приложения iOS',
            status: 'review',
            priority: 'high',
            assignee: 'Мария Новикова',
            deadline: getDateString(7),
            workload: 70
        },
        {
            id: 'T-006',
            title: 'Оптимизация производительности базы данных',
            status: 'in-progress',
            priority: 'high',
            assignee: 'Сергей Морозов',
            deadline: getDateString(4),
            workload: 75
        },
        {
            id: 'T-007',
            title: 'Создание документации API v2.0',
            status: 'new',
            priority: 'medium',
            assignee: 'Ольга Соколова',
            deadline: getDateString(15),
            workload: 30
        },
        {
            id: 'T-008',
            title: 'Миграция данных на новый сервер',
            status: 'paused',
            priority: 'critical',
            assignee: 'Алексей Кузнецов',
            deadline: getDateString(1),
            workload: 90
        },
        {
            id: 'T-009',
            title: 'Разработка модуля аналитики и отчетов',
            status: 'in-progress',
            priority: 'high',
            assignee: 'Татьяна Лебедева',
            deadline: getDateString(8),
            workload: 60
        },
        {
            id: 'T-010',
            title: 'Интеграция с платежной системой Stripe',
            status: 'new',
            priority: 'high',
            assignee: 'Павел Орлов',
            deadline: getDateString(12),
            workload: 55
        },
        {
            id: 'T-011',
            title: 'Рефакторинг legacy кода в модуле авторизации',
            status: 'in-progress',
            priority: 'medium',
            assignee: 'Иван Петров',
            deadline: getDateString(20),
            workload: 45
        },
        {
            id: 'T-012',
            title: 'Проведение code review для команды',
            status: 'review',
            priority: 'low',
            assignee: 'Елена Коваль',
            deadline: getDateString(6),
            workload: 25
        },
        {
            id: 'T-013',
            title: 'Настройка мониторинга и алертов Grafana',
            status: 'new',
            priority: 'medium',
            assignee: 'Дмитрий Волков',
            deadline: getDateString(14),
            workload: 35
        },
        {
            id: 'T-014',
            title: 'Разработка email-рассылок для маркетинга',
            status: 'done',
            priority: 'low',
            assignee: 'Анна Смирнова',
            deadline: getDateString(-5),
            workload: 100
        },
        {
            id: 'T-015',
            title: 'Тестирование безопасности веб-приложения',
            status: 'in-progress',
            priority: 'critical',
            assignee: 'Мария Новикова',
            deadline: getDateString(3),
            workload: 80
        },
        {
            id: 'T-016',
            title: 'Создание прототипа нового интерфейса',
            status: 'new',
            priority: 'medium',
            assignee: 'Сергей Морозов',
            deadline: getDateString(18),
            workload: 50
        },
        {
            id: 'T-017',
            title: 'Оптимизация SEO для корпоративного сайта',
            status: 'review',
            priority: 'low',
            assignee: 'Ольга Соколова',
            deadline: getDateString(9),
            workload: 40
        },
        {
            id: 'T-018',
            title: 'Разработка мобильной версии админ-панели',
            status: 'in-progress',
            priority: 'high',
            assignee: 'Алексей Кузнецов',
            deadline: getDateString(11),
            workload: 70
        },
        {
            id: 'T-019',
            title: 'Настройка резервного копирования данных',
            status: 'new',
            priority: 'critical',
            assignee: 'Татьяна Лебедева',
            deadline: getDateString(4),
            workload: 60
        },
        {
            id: 'T-020',
            title: 'Проведение обучения новых сотрудников',
            status: 'done',
            priority: 'low',
            assignee: 'Павел Орлов',
            deadline: getDateString(-2),
            workload: 100
        },
        {
            id: 'T-021',
            title: 'Разработка системы уведомлений push',
            status: 'in-progress',
            priority: 'medium',
            assignee: 'Иван Петров',
            deadline: getDateString(16),
            workload: 55
        },
        {
            id: 'T-022',
            title: 'Анализ конкурентов и рынка',
            status: 'new',
            priority: 'low',
            assignee: 'Елена Коваль',
            deadline: getDateString(25),
            workload: 20
        },
        {
            id: 'T-023',
            title: 'Интеграция с CRM системой Salesforce',
            status: 'review',
            priority: 'high',
            assignee: 'Дмитрий Волков',
            deadline: getDateString(7),
            workload: 65
        },
        {
            id: 'T-024',
            title: 'Создание видео-инструкций для пользователей',
            status: 'new',
            priority: 'medium',
            assignee: 'Анна Смирнова',
            deadline: getDateString(22),
            workload: 45
        },
        {
            id: 'T-025',
            title: 'Оптимизация скорости загрузки страниц',
            status: 'in-progress',
            priority: 'high',
            assignee: 'Мария Новикова',
            deadline: getDateString(6),
            workload: 70
        }
    ]
};

// Вспомогательная функция для получения даты
function getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

// Экспорт для использования в других модулях
window.DemoData = DemoData;