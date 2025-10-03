/**
 * Система хранения данных в localStorage
 * Заменяет серверную базу данных для статического сайта
 */

class Storage {
    constructor() {
        this.keys = {
            TASKS: 'cursor_pipeline_tasks',
            USERS: 'cursor_pipeline_users',
            SETTINGS: 'cursor_pipeline_settings',
            SESSION: 'cursor_pipeline_session'
        };
        
        this.init();
    }
    
    init() {
        // Проверяем поддержку localStorage
        if (!this.isSupported()) {
            console.warn('localStorage не поддерживается. Данные не будут сохраняться.');
            return;
        }
        
        // Инициализируем базовые данные если их нет
        this.initDefaultData();
    }
    
    isSupported() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    initDefaultData() {
        // Инициализируем настройки
        if (!this.getSettings()) {
            this.setSettings({
                theme: 'light',
                language: 'ru',
                notifications: true,
                autoSave: true
            });
        }
        
        // Инициализируем сессию
        if (!this.getSession()) {
            this.setSession({
                startTime: Date.now(),
                lastActivity: Date.now(),
                sessionId: this.generateId()
            });
        }
        
        // Загружаем демо-данные если нет пользователей
        if (!this.getUsers() || this.getUsers().length === 0) {
            this.loadDemoData();
        }
    }
    
    // Универсальные методы для работы с данными
    setItem(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
            return false;
        }
    }
    
    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Ошибка чтения из localStorage:', e);
            return defaultValue;
        }
    }
    
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Ошибка удаления из localStorage:', e);
            return false;
        }
    }
    
    // Методы для задач
    getTasks() {
        return this.getItem(this.keys.TASKS, []);
    }
    
    setTasks(tasks) {
        return this.setItem(this.keys.TASKS, tasks);
    }
    
    addTask(task) {
        const tasks = this.getTasks();
        const newTask = {
            ...task,
            id: this.generateId(),
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        tasks.push(newTask);
        this.setTasks(tasks);
        return newTask;
    }
    
    updateTask(taskId, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            tasks[index] = {
                ...tasks[index],
                ...updates,
                updatedAt: Date.now()
            };
            this.setTasks(tasks);
            return tasks[index];
        }
        return null;
    }
    
    deleteTask(taskId) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        this.setTasks(filteredTasks);
        return true;
    }
    
    getTaskById(taskId) {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === taskId);
    }
    
    // Методы для пользователей
    getUsers() {
        return this.getItem(this.keys.USERS, []);
    }
    
    setUsers(users) {
        return this.setItem(this.keys.USERS, users);
    }
    
    addUser(user) {
        const users = this.getUsers();
        const newUser = {
            ...user,
            id: this.generateId(),
            createdAt: Date.now(),
            isActive: true
        };
        users.push(newUser);
        this.setUsers(users);
        return newUser;
    }
    
    updateUser(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === userId);
        if (index !== -1) {
            users[index] = {
                ...users[index],
                ...updates,
                updatedAt: Date.now()
            };
            this.setUsers(users);
            return users[index];
        }
        return null;
    }
    
    deleteUser(userId) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        this.setUsers(filteredUsers);
        return true;
    }
    
    getUserById(userId) {
        const users = this.getUsers();
        return users.find(user => user.id === userId);
    }
    
    // Методы для настроек
    getSettings() {
        return this.getItem(this.keys.SETTINGS, {});
    }
    
    setSettings(settings) {
        return this.setItem(this.keys.SETTINGS, settings);
    }
    
    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.setSettings(settings);
        return settings;
    }
    
    // Методы для сессии
    getSession() {
        return this.getItem(this.keys.SESSION, {});
    }
    
    setSession(session) {
        return this.setItem(this.keys.SESSION, session);
    }
    
    updateSession(updates) {
        const session = this.getSession();
        const newSession = {
            ...session,
            ...updates,
            lastActivity: Date.now()
        };
        this.setSession(newSession);
        return newSession;
    }
    
    // Экспорт и импорт данных
    exportData() {
        const data = {
            tasks: this.getTasks(),
            users: this.getUsers(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cursor-pipeline-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return data;
    }
    
    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (data.tasks) this.setTasks(data.tasks);
            if (data.users) this.setUsers(data.users);
            if (data.settings) this.setSettings(data.settings);
            
            return true;
        } catch (e) {
            console.error('Ошибка импорта данных:', e);
            return false;
        }
    }
    
    // Очистка данных
    clearAllData() {
        Object.values(this.keys).forEach(key => {
            this.removeItem(key);
        });
        this.initDefaultData();
        return true;
    }
    
    // Загрузка демо-данных
    loadDemoData() {
        // Демо-пользователи
        const demoUsers = [
            {
                name: 'Анна Иванова',
                role: 'supervisor',
                department: 'IT отдел',
                email: 'anna.ivanova@company.com',
                avatar: '👩‍💼'
            },
            {
                name: 'Михаил Петров',
                role: 'executor',
                department: 'IT отдел',
                email: 'mikhail.petrov@company.com',
                avatar: '👨‍💻'
            },
            {
                name: 'Елена Сидорова',
                role: 'executor',
                department: 'IT отдел',
                email: 'elena.sidorova@company.com',
                avatar: '👩‍💻'
            },
            {
                name: 'Дмитрий Козлов',
                role: 'manager',
                department: 'IT отдел',
                email: 'dmitry.kozlov@company.com',
                avatar: '👨‍💼'
            },
            {
                name: 'Ольга Новикова',
                role: 'executor',
                department: 'HR отдел',
                email: 'olga.novikova@company.com',
                avatar: '👩‍🎓'
            },
            {
                name: 'Сергей Волков',
                role: 'executor',
                department: 'Маркетинг',
                email: 'sergey.volkov@company.com',
                avatar: '👨‍🎨'
            },
            {
                name: 'Татьяна Морозова',
                role: 'executor',
                department: 'Маркетинг',
                email: 'tatyana.morozova@company.com',
                avatar: '👩‍🎨'
            },
            {
                name: 'Александр Соколов',
                role: 'business',
                department: 'Маркетинг',
                email: 'alexander.sokolov@company.com',
                avatar: '👨‍💼'
            }
        ];
        
        this.setUsers(demoUsers);
        
        // Демо-задачи
        const demoTasks = [
            {
                title: 'Разработка нового API',
                description: 'Создать REST API для мобильного приложения с поддержкой аутентификации',
                priority: 'high',
                assignee: demoUsers[1].name,
                deadline: this.getDateString(7),
                tags: ['разработка', 'API', 'backend'],
                status: 'in-progress'
            },
            {
                title: 'Дизайн главной страницы',
                description: 'Создать современный дизайн главной страницы сайта',
                priority: 'medium',
                assignee: demoUsers[2].name,
                deadline: this.getDateString(5),
                tags: ['дизайн', 'frontend', 'UI'],
                status: 'new'
            },
            {
                title: 'Настройка CI/CD',
                description: 'Настроить автоматическое развертывание и тестирование',
                priority: 'high',
                assignee: demoUsers[0].name,
                deadline: this.getDateString(10),
                tags: ['DevOps', 'CI/CD', 'автоматизация'],
                status: 'new'
            },
            {
                title: 'Рекрутинг разработчиков',
                description: 'Поиск и собеседование кандидатов на позицию Frontend разработчика',
                priority: 'medium',
                assignee: demoUsers[4].name,
                deadline: this.getDateString(14),
                tags: ['HR', 'рекрутинг', 'собеседования'],
                status: 'in-progress'
            },
            {
                title: 'Маркетинговая кампания',
                description: 'Запуск рекламной кампании в социальных сетях',
                priority: 'medium',
                assignee: demoUsers[5].name,
                deadline: this.getDateString(3),
                tags: ['маркетинг', 'SMM', 'реклама'],
                status: 'review'
            },
            {
                title: 'Тестирование мобильного приложения',
                description: 'Провести полное тестирование всех функций мобильного приложения',
                priority: 'high',
                assignee: demoUsers[2].name,
                deadline: this.getDateString(-2),
                tags: ['тестирование', 'QA', 'мобильное приложение'],
                status: 'done'
            },
            {
                title: 'Обновление базы данных',
                description: 'Миграция данных и оптимизация производительности БД',
                priority: 'critical',
                assignee: demoUsers[1].name,
                deadline: this.getDateString(1),
                tags: ['база данных', 'миграция', 'оптимизация'],
                status: 'in-progress'
            },
            {
                title: 'Создание документации API',
                description: 'Написание подробной документации для разработчиков',
                priority: 'medium',
                assignee: demoUsers[0].name,
                deadline: this.getDateString(8),
                tags: ['документация', 'API', 'разработка'],
                status: 'new'
            },
            {
                title: 'Анализ конкурентов',
                description: 'Исследование рынка и анализ продуктов конкурентов',
                priority: 'low',
                assignee: demoUsers[7].name,
                deadline: this.getDateString(20),
                tags: ['анализ', 'исследования', 'конкуренты'],
                status: 'new'
            },
            {
                title: 'Интеграция с платежной системой',
                description: 'Подключение и настройка обработки платежей',
                priority: 'high',
                assignee: demoUsers[1].name,
                deadline: this.getDateString(12),
                tags: ['интеграция', 'платежи', 'безопасность'],
                status: 'new'
            }
        ];
        
        this.setTasks(demoTasks);
        
        console.log('✅ Демо-данные загружены');
    }
    
    // Утилиты
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getDateString(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }
    
    // Статистика
    getStorageStats() {
        let totalSize = 0;
        Object.values(this.keys).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                totalSize += item.length;
            }
        });
        
        return {
            totalSize: totalSize,
            totalSizeKB: Math.round(totalSize / 1024 * 100) / 100,
            itemsCount: Object.keys(this.keys).length,
            tasksCount: this.getTasks().length,
            usersCount: this.getUsers().length
        };
    }
}

// Создаем глобальный экземпляр
window.storage = new Storage();
