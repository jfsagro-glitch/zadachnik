/**
 * Основное приложение ЗАДАЧНИК
 * Статическая версия без серверной части
 */

class ZadachnikApp {
    constructor() {
        this.currentTab = 'kanban';
        this.draggedTask = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadData();
        this.render();
        this.setupDragAndDrop();
        
        Utils.showNotification('ЗАДАЧНИК загружен!', 'success');
    }
    
    setupEventListeners() {
        // Навигация по табам
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Кнопки в демо-баннере
        document.getElementById('reset-data')?.addEventListener('click', () => {
            this.resetData();
        });
        
        document.getElementById('export-data')?.addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('import-data')?.addEventListener('click', () => {
            this.importData();
        });
        
        // Модальные окна
        this.setupModals();
        
        // Формы
        this.setupForms();
        
        // Настройки
        this.setupSettings();
    }
    
    setupModals() {
        // Кнопки открытия модальных окон
        document.getElementById('new-task-btn')?.addEventListener('click', () => {
            this.openTaskModal();
        });
        
        document.getElementById('add-user-btn')?.addEventListener('click', () => {
            this.openUserModal();
        });
        
        // Закрытие модальных окон
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });
        
        // Закрытие по клику вне модального окна
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }
    
    setupForms() {
        // Форма задачи
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTask();
            });
        }
        
        // Форма пользователя
        const userForm = document.getElementById('user-form');
        if (userForm) {
            userForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveUser();
            });
        }
    }
    
    setupSettings() {
        // Загрузка демо-данных
        document.getElementById('load-demo-data')?.addEventListener('click', () => {
            this.loadDemoData();
        });
        
        // Очистка всех данных
        document.getElementById('clear-all-data')?.addEventListener('click', () => {
            this.clearAllData();
        });
        
        // Выбор темы
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = Utils.getTheme();
            themeSelect.addEventListener('change', (e) => {
                Utils.setTheme(e.target.value);
                Utils.showNotification('Тема изменена', 'success');
            });
        }
    }
    
    setupDragAndDrop() {
        // Настройка перетаскивания задач
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task')) {
                this.draggedTask = e.target.dataset.taskId;
                e.target.classList.add('dragging');
            }
        });
        
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task')) {
                e.target.classList.remove('dragging');
                this.draggedTask = null;
            }
        });
        
        // Настройка зон сброса
        document.querySelectorAll('.kanban-column').forEach(column => {
            Utils.makeDropZone(column, null, (e) => {
                if (this.draggedTask) {
                    const newStatus = column.dataset.status;
                    this.moveTask(this.draggedTask, newStatus);
                }
            });
        });
    }
    
    // Навигация
    switchTab(tab) {
        // Обновляем активную кнопку
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Показываем активный контент
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
        
        this.currentTab = tab;
        
        // Обновляем данные для активного таба
        this.updateTabContent(tab);
    }
    
    updateTabContent(tab) {
        switch (tab) {
            case 'kanban':
                this.renderKanban();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'team':
                this.renderTeam();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }
    
    // Загрузка и сохранение данных
    loadData() {
        this.tasks = storage.getTasks();
        this.users = storage.getUsers();
        this.settings = storage.getSettings();
    }
    
    saveData() {
        storage.setTasks(this.tasks);
        storage.setUsers(this.users);
        storage.setSettings(this.settings);
    }
    
    // Рендеринг
    render() {
        this.renderKanban();
        this.updateUserSelects();
    }
    
    renderKanban() {
        const columns = ['new', 'in-progress', 'review', 'done'];
        
        columns.forEach(status => {
            const tasks = this.tasks.filter(task => task.status === status);
            const container = document.getElementById(`tasks-${status}`);
            const countElement = document.getElementById(`count-${status}`);
            
            if (countElement) {
                countElement.textContent = tasks.length;
            }
            
            if (container) {
                container.innerHTML = tasks.map(task => this.renderTask(task)).join('');
            }
        });
        
        // Добавляем обработчики событий для задач
        this.setupTaskEventListeners();
    }
    
    renderTask(task) {
        const deadlineClass = Utils.getDeadlineClass(task.deadline);
        const priorityClass = Utils.getPriorityClass(task.priority);
        const deadlineText = Utils.formatDate(task.deadline);
        
        const tags = task.tags ? task.tags.map(tag => 
            `<span class="task-tag">${tag}</span>`
        ).join('') : '';
        
        return `
            <div class="task" data-task-id="${task.id}" draggable="true">
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    <span class="task-priority ${priorityClass}">
                        ${Utils.getPriorityText(task.priority)}
                    </span>
                </div>
                <div class="task-description">${task.description}</div>
                <div class="task-meta">
                    <span class="task-assignee">👤 ${task.assignee || 'Не назначено'}</span>
                    <span class="task-deadline ${deadlineClass}">${deadlineText}</span>
                </div>
                ${tags ? `<div class="task-tags">${tags}</div>` : ''}
            </div>
        `;
    }
    
    setupTaskEventListeners() {
        document.querySelectorAll('.task').forEach(task => {
            task.addEventListener('dblclick', () => {
                const taskId = task.dataset.taskId;
                this.editTask(taskId);
            });
        });
    }
    
    renderAnalytics() {
        const stats = Utils.calculateTaskStats(this.tasks);
        
        // Обновляем метрики
        document.getElementById('metric-completed').textContent = stats.done;
        document.getElementById('metric-overdue').textContent = stats.overdue;
        document.getElementById('metric-completion').textContent = `${stats.completionRate}%`;
        document.getElementById('metric-active').textContent = this.users.filter(u => u.isActive).length;
        
        // Рендерим графики
        this.renderCharts();
    }
    
    renderCharts() {
        const statusChart = document.getElementById('status-chart');
        const teamChart = document.getElementById('team-chart');
        
        if (statusChart) {
            this.renderStatusChart(statusChart);
        }
        
        if (teamChart) {
            this.renderTeamChart(teamChart);
        }
    }
    
    renderStatusChart(canvas) {
        const data = charts.createTaskStatusData(this.tasks);
        charts.drawPieChart(canvas, data, {
            colors: ['#667eea', '#764ba2', '#f093fb', '#4caf50'],
            showLegend: true,
            showCenter: true
        });
    }
    
    renderTeamChart(canvas) {
        const data = charts.createUserWorkloadData(this.users, this.tasks);
        charts.drawBarChart(canvas, data, {
            colors: ['#667eea', '#764ba2', '#f093fb', '#4caf50', '#20b2aa', '#ff9800', '#f44336', '#2196f3']
        });
    }
    
    renderTeam() {
        const container = document.getElementById('team-grid');
        if (!container) return;
        
        const userStats = Utils.calculateUserStats(this.users, this.tasks);
        
        container.innerHTML = userStats.map(user => `
            <div class="user-card">
                <div class="user-avatar">${user.avatar}</div>
                <div class="user-name">${user.name}</div>
                <div class="user-role">${Utils.getRoleText(user.role)}</div>
                <div class="user-department">${user.department}</div>
                <div class="user-stats">
                    <div class="user-stat">
                        <div class="user-stat-value">${user.totalTasks}</div>
                        <div class="user-stat-label">Всего</div>
                    </div>
                    <div class="user-stat">
                        <div class="user-stat-value">${user.activeTasks}</div>
                        <div class="user-stat-label">Активных</div>
                    </div>
                    <div class="user-stat">
                        <div class="user-stat-value">${user.completionRate}%</div>
                        <div class="user-stat-label">Выполнено</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderSettings() {
        // Настройки уже рендерятся в HTML
    }
    
    // Модальные окна
    openTaskModal(taskId = null) {
        const modal = document.getElementById('task-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('task-form');
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                title.textContent = 'Редактировать задачу';
                this.fillTaskForm(task);
            }
        } else {
            title.textContent = 'Новая задача';
            form.reset();
            document.getElementById('task-deadline').value = this.getDefaultDeadline();
        }
        
        modal.classList.add('active');
    }
    
    openUserModal(userId = null) {
        const modal = document.getElementById('user-modal');
        const title = document.getElementById('user-modal-title');
        const form = document.getElementById('user-form');
        
        if (userId) {
            const user = this.users.find(u => u.id === userId);
            if (user) {
                title.textContent = 'Редактировать пользователя';
                this.fillUserForm(user);
            }
        } else {
            title.textContent = 'Новый пользователь';
            form.reset();
        }
        
        modal.classList.add('active');
    }
    
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    fillTaskForm(task) {
        document.getElementById('task-title').value = task.title || '';
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-priority').value = task.priority || 'medium';
        document.getElementById('task-assignee').value = task.assignee || '';
        document.getElementById('task-deadline').value = task.deadline || '';
        document.getElementById('task-tags').value = task.tags ? task.tags.join(', ') : '';
    }
    
    fillUserForm(user) {
        document.getElementById('user-name').value = user.name || '';
        document.getElementById('user-role').value = user.role || 'executor';
        document.getElementById('user-department').value = user.department || '';
        document.getElementById('user-email').value = user.email || '';
    }
    
    // Сохранение данных
    saveTask() {
        const form = document.getElementById('task-form');
        const formData = new FormData(form);
        
        const taskData = {
            title: formData.get('task-title') || document.getElementById('task-title').value,
            description: formData.get('task-description') || document.getElementById('task-description').value,
            priority: formData.get('task-priority') || document.getElementById('task-priority').value,
            assignee: formData.get('task-assignee') || document.getElementById('task-assignee').value,
            deadline: formData.get('task-deadline') || document.getElementById('task-deadline').value,
            tags: (formData.get('task-tags') || document.getElementById('task-tags').value)
                .split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        // Валидация
        if (!Utils.validateRequired(taskData.title)) {
            Utils.showNotification('Введите название задачи', 'error');
            return;
        }
        
        const existingTask = this.tasks.find(t => t.title === taskData.title && t.id !== this.editingTaskId);
        if (existingTask) {
            Utils.showNotification('Задача с таким названием уже существует', 'error');
            return;
        }
        
        if (this.editingTaskId) {
            // Редактирование существующей задачи
            const updatedTask = storage.updateTask(this.editingTaskId, taskData);
            if (updatedTask) {
                const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
                this.tasks[index] = updatedTask;
                Utils.showNotification('Задача обновлена', 'success');
            }
        } else {
            // Создание новой задачи
            const newTask = storage.addTask({
                ...taskData,
                status: 'new'
            });
            this.tasks.push(newTask);
            Utils.showNotification('Задача создана', 'success');
        }
        
        this.closeModals();
        this.renderKanban();
        this.updateUserSelects();
    }
    
    saveUser() {
        const form = document.getElementById('user-form');
        const formData = new FormData(form);
        
        const userData = {
            name: formData.get('user-name') || document.getElementById('user-name').value,
            role: formData.get('user-role') || document.getElementById('user-role').value,
            department: formData.get('user-department') || document.getElementById('user-department').value,
            email: formData.get('user-email') || document.getElementById('user-email').value
        };
        
        // Валидация
        if (!Utils.validateRequired(userData.name)) {
            Utils.showNotification('Введите имя пользователя', 'error');
            return;
        }
        
        if (userData.email && !Utils.validateEmail(userData.email)) {
            Utils.showNotification('Введите корректный email', 'error');
            return;
        }
        
        const existingUser = this.users.find(u => u.name === userData.name && u.id !== this.editingUserId);
        if (existingUser) {
            Utils.showNotification('Пользователь с таким именем уже существует', 'error');
            return;
        }
        
        if (this.editingUserId) {
            // Редактирование существующего пользователя
            const updatedUser = storage.updateUser(this.editingUserId, userData);
            if (updatedUser) {
                const index = this.users.findIndex(u => u.id === this.editingUserId);
                this.users[index] = updatedUser;
                Utils.showNotification('Пользователь обновлен', 'success');
            }
        } else {
            // Создание нового пользователя
            const newUser = storage.addUser({
                ...userData,
                avatar: this.getRandomAvatar()
            });
            this.users.push(newUser);
            Utils.showNotification('Пользователь добавлен', 'success');
        }
        
        this.closeModals();
        this.renderTeam();
        this.updateUserSelects();
    }
    
    // Дополнительные методы
    updateUserSelects() {
        const selects = document.querySelectorAll('#task-assignee');
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Не назначено</option>';
            
            this.users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.name;
                option.textContent = user.name;
                select.appendChild(option);
            });
            
            select.value = currentValue;
        });
    }
    
    moveTask(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            task.updatedAt = Date.now();
            storage.updateTask(taskId, { status: newStatus });
            this.renderKanban();
            Utils.showNotification('Задача перемещена', 'success');
        }
    }
    
    editTask(taskId) {
        this.editingTaskId = taskId;
        this.openTaskModal(taskId);
    }
    
    resetData() {
        if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            storage.clearAllData();
            this.loadData();
            this.render();
            Utils.showNotification('Данные сброшены', 'success');
        }
    }
    
    loadDemoData() {
        storage.loadDemoData();
        this.loadData();
        this.render();
        Utils.showNotification('Демо-данные загружены', 'success');
    }
    
    clearAllData() {
        if (confirm('Вы уверены, что хотите удалить ВСЕ данные? Это действие нельзя отменить.')) {
            storage.clearAllData();
            this.loadData();
            this.render();
            Utils.showNotification('Все данные удалены', 'warning');
        }
    }
    
    exportData() {
        const data = storage.exportData();
        Utils.showNotification('Данные экспортированы', 'success');
    }
    
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                Utils.readFile(file).then(content => {
                    if (storage.importData(content)) {
                        this.loadData();
                        this.render();
                        Utils.showNotification('Данные импортированы', 'success');
                    } else {
                        Utils.showNotification('Ошибка импорта данных', 'error');
                    }
                });
            }
        });
        
        input.click();
    }
    
    getDefaultDeadline() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    }
    
    getRandomAvatar() {
        const avatars = ['👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🎨', '👩‍🎨', '👨‍🎓', '👩‍🎓', '👨‍🔧', '👩‍🔧'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ZadachnikApp();
});
