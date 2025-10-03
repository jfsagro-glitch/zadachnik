// Mock API для статической версии на GitHub Pages
class MockAPIClient {
    constructor() {
        this.baseURL = '';
        this.sessionId = this.getOrCreateSessionId();
        this.demoData = this.generateMockData();
    }

    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('demo_session_id');
        if (!sessionId) {
            sessionId = 'demo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('demo_session_id', sessionId);
        }
        return sessionId;
    }

    generateMockData() {
        const users = [
            {
                id: 'user-1',
                name: 'Иван Петров',
                email: 'i.petrov@demo-cursor.ru',
                role: 'executor',
                department: 'IT отдел',
                position: 'Frontend разработчик',
                workload: 65,
                available: true
            },
            {
                id: 'user-2',
                name: 'Елена Коваль',
                email: 'e.koval@demo-cursor.ru',
                role: 'executor',
                department: 'IT отдел',
                position: 'Backend разработчик',
                workload: 85,
                available: true
            },
            {
                id: 'user-3',
                name: 'Анна Сидорова',
                email: 'a.sidorova@demo-cursor.ru',
                role: 'executor',
                department: 'HR отдел',
                position: 'HR менеджер',
                workload: 45,
                available: true
            },
            {
                id: 'user-4',
                name: 'Дмитрий Козлов',
                email: 'd.kozlov@demo-cursor.ru',
                role: 'supervisor',
                department: 'IT отдел',
                position: 'Руководитель IT отдела',
                workload: 30,
                available: true
            },
            {
                id: 'user-5',
                name: 'Ольга Новикова',
                email: 'o.novikova@demo-cursor.ru',
                role: 'business_user',
                department: 'Маркетинг',
                position: 'Менеджер по маркетингу',
                workload: 55,
                available: true
            }
        ];

        const tasks = [
            {
                id: 'task-1',
                title: 'Разработка нового модуля аутентификации',
                description: 'Создание системы двухфакторной аутентификации для повышения безопасности',
                assignee: 'user-1',
                priority: 'high',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'in_progress',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'task-2',
                title: 'Подбор Senior Frontend разработчика',
                description: 'Поиск и отбор кандидатов на позицию Senior Frontend с опытом React 3+ лет',
                assignee: 'user-3',
                priority: 'high',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'new',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'task-3',
                title: 'Исправление ошибки в модуле отчетности',
                description: 'Критическая ошибка в расчете KPI сотрудников требует немедленного исправления',
                assignee: 'user-2',
                priority: 'critical',
                dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'review',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'task-4',
                title: 'Проведение собеседования с кандидатом',
                description: 'Техническое интервью с кандидатом на позицию Backend разработчика',
                assignee: 'user-3',
                priority: 'medium',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'in_progress',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'task-5',
                title: 'Подготовка отчета по анализу рынка',
                description: 'Исследование конкурентов и анализ трендов в IT-сфере',
                assignee: 'user-5',
                priority: 'medium',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'done',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'task-6',
                title: 'Разработка плана обучения для новых сотрудников',
                description: 'Создание программы адаптации и обучения для новых сотрудников',
                assignee: 'user-3',
                priority: 'medium',
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'new',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        return { users, tasks };
    }

    async request(endpoint, options = {}) {
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

        const method = options.method || 'GET';
        
        try {
            switch (endpoint) {
                case '/demo/sessions':
                    if (method === 'POST') {
                        return this.createDemoSession();
                    }
                    break;
                case '/tasks':
                    if (method === 'GET') {
                        return this.demoData.tasks;
                    } else if (method === 'POST') {
                        return this.createTask(options.body);
                    }
                    break;
                case '/users':
                    if (method === 'GET') {
                        return this.demoData.users;
                    }
                    break;
                default:
                    if (endpoint.startsWith('/tasks/') && endpoint.endsWith('/status') && method === 'PUT') {
                        return this.updateTaskStatus(endpoint, options.body);
                    }
                    if (endpoint.startsWith('/tasks/') && method === 'PUT') {
                        return this.updateTask(endpoint, options.body);
                    }
                    if (endpoint.startsWith('/tasks/') && method === 'DELETE') {
                        return this.deleteTask(endpoint);
                    }
            }
        } catch (error) {
            console.error('Mock API Error:', error);
            throw error;
        }
    }

    createDemoSession() {
        const demoUser = {
            id: 'demo-user',
            name: 'Демо Пользователь',
            email: 'demo@cursor-pipeline.ru',
            role: 'supervisor',
            department: 'IT отдел',
            position: 'Супервайзер',
            isTemporary: true
        };

        return {
            sessionId: this.sessionId,
            user: demoUser,
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            message: 'Демо-сессия создана успешно (статистическая версия)'
        };
    }

    createTask(taskData) {
        const newTask = {
            id: 'task-' + Date.now(),
            ...JSON.parse(taskData),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.demoData.tasks.push(newTask);
        return newTask;
    }

    updateTaskStatus(endpoint, body) {
        const taskId = endpoint.split('/')[2];
        const { status } = JSON.parse(body);
        const task = this.demoData.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            task.updatedAt = new Date().toISOString();
        }
        return task;
    }

    updateTask(endpoint, body) {
        const taskId = endpoint.split('/')[2];
        const updates = JSON.parse(body);
        const task = this.demoData.tasks.find(t => t.id === taskId);
        if (task) {
            Object.assign(task, updates);
            task.updatedAt = new Date().toISOString();
        }
        return task;
    }

    deleteTask(endpoint) {
        const taskId = endpoint.split('/')[2];
        const taskIndex = this.demoData.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            const deletedTask = this.demoData.tasks[taskIndex];
            this.demoData.tasks.splice(taskIndex, 1);
            return { message: 'Задача удалена', task: deletedTask };
        }
        throw new Error('Задача не найдена');
    }

    // Методы для совместимости с основным API
    async createDemoSession(role = 'supervisor') {
        return this.request('/demo/sessions', { method: 'POST' });
    }

    async getDemoSession() {
        return {
            sessionId: this.sessionId,
            user: {
                id: 'demo-user',
                name: 'Демо Пользователь',
                role: 'supervisor'
            },
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        };
    }

    async getTasks() {
        return this.demoData.tasks;
    }

    async createTask(taskData) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    }

    async updateTaskStatus(taskId, status) {
        return this.request(`/tasks/${taskId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    async updateTask(taskId, taskData) {
        return this.request(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    }

    async deleteTask(taskId) {
        return this.request(`/tasks/${taskId}`, { method: 'DELETE' });
    }

    async getUsers() {
        return this.demoData.users;
    }

    async getUser(userId) {
        return this.demoData.users.find(u => u.id === userId);
    }

    async updateUserAvailability(userId, available) {
        const user = this.demoData.users.find(u => u.id === userId);
        if (user) {
            user.available = available;
            user.lastActivity = new Date().toISOString();
        }
        return { message: available ? 'Пользователь доступен' : 'Пользователь недоступен', user };
    }

    async getAnalytics() {
        const tasks = this.demoData.tasks;
        const completedTasks = tasks.filter(task => task.status === 'done').length;
        const overdueTasks = tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate < new Date() && task.status !== 'done';
        }).length;
        
        const completionRate = tasks.length > 0 ? 
            Math.round((completedTasks / tasks.length) * 100) : 0;
        
        return {
            tasksCompleted: completedTasks,
            tasksOverdue: overdueTasks,
            completionRate,
            averageWorkload: 58,
            overloadedUsers: 1,
            totalTasks: tasks.length,
            totalUsers: this.demoData.users.length
        };
    }

    async getMetrics() {
        return this.getAnalytics();
    }

    async generateTestTasks() {
        const newTasks = [
            {
                title: 'Тестовая задача 1',
                description: 'Автоматически созданная тестовая задача',
                assignee: 'user-1',
                priority: 'medium',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'new'
            },
            {
                title: 'Тестовая задача 2',
                description: 'Еще одна тестовая задача для демонстрации',
                assignee: 'user-2',
                priority: 'high',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'new'
            }
        ];

        newTasks.forEach(task => {
            this.demoData.tasks.push({
                id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                ...task,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        });

        return {
            message: 'Тестовые задачи созданы',
            newTasks: newTasks.length,
            totalTasks: this.demoData.tasks.length
        };
    }

    async simulateWorkload() {
        this.demoData.users.forEach(user => {
            user.workload = Math.floor(Math.random() * 100);
        });

        return {
            message: 'Загрузка симулирована',
            users: this.demoData.users
        };
    }

    async resetDemoSession() {
        this.demoData = this.generateMockData();
        return {
            message: 'Демо-данные сброшены к исходному состоянию',
            tasks: this.demoData.tasks,
            users: this.demoData.users
        };
    }
}

// Глобальный экземпляр для статической версии
if (typeof window !== 'undefined') {
    window.api = new MockAPIClient();
}
