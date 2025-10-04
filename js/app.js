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
        
        // Компактный режим
        const compactModeCheckbox = document.getElementById('compact-mode');
        if (compactModeCheckbox) {
            compactModeCheckbox.checked = Utils.getCompactMode();
            compactModeCheckbox.addEventListener('change', (e) => {
                Utils.setCompactMode(e.target.checked);
                Utils.showNotification('Компактный режим ' + (e.target.checked ? 'включен' : 'выключен'), 'success');
            });
        }
        
        // Выбор вида отображения
        const viewModeSelect = document.getElementById('view-mode');
        if (viewModeSelect) {
            viewModeSelect.value = Utils.getViewMode();
            viewModeSelect.addEventListener('change', (e) => {
                Utils.setViewMode(e.target.value);
                // Небольшая задержка для корректного переключения
                setTimeout(() => {
                    this.renderTasks(); // Перерисовка задач в новом виде
                }, 50);
                Utils.showNotification('Вид изменен на: ' + e.target.options[e.target.selectedIndex].text, 'success');
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
    
    renderTasks() {
        const tasks = Storage.getTasks();
        const users = Storage.getUsers();
        const viewMode = Utils.getViewMode();
        
        // Очистка всех колонок
        document.querySelectorAll('.task-list').forEach(list => {
            list.innerHTML = '';
        });
        
        // Сброс счетчиков
        document.querySelectorAll('.task-count').forEach(counter => {
            counter.textContent = '0';
        });
        
        // Группировка задач по статусам
        const tasksByStatus = {
            new: [],
            'in-progress': [],
            review: [],
            done: []
        };
        
        tasks.forEach(task => {
            if (tasksByStatus[task.status]) {
                tasksByStatus[task.status].push(task);
            }
        });
        
        // Рендеринг в зависимости от выбранного вида
        switch(viewMode) {
            case 'kanban':
                this.renderKanbanView(tasksByStatus, users);
                break;
            case 'table':
                this.renderTableView(tasks, users);
                break;
            case 'list':
                this.renderListView(tasks, users);
                break;
            case 'info':
                this.renderInfoView(tasks, users);
                break;
        }
        
        this.updateAnalytics();
    }
    
    updateAnalytics() {
        // Обновляем аналитику при смене задач
        try {
            if (this.currentTab === 'analytics') {
                this.renderAnalytics();
            }
        } catch (error) {
            console.warn('Ошибка обновления аналитики:', error);
        }
    }
    
    renderKanbanView(tasksByStatus, users) {
        // Рендеринг задач в соответствующие колонки
        Object.keys(tasksByStatus).forEach(status => {
            const taskList = document.getElementById(`tasks-${status}`);
            const counter = document.getElementById(`count-${status}`);
            
            if (taskList && counter) {
                counter.textContent = tasksByStatus[status].length;
                
                tasksByStatus[status].forEach(task => {
                    const taskElement = this.createTaskElement(task, users);
                    taskList.appendChild(taskElement);
                });
            }
        });
    }
    
    renderTableView(tasks, users) {
        const tbody = document.getElementById('tasks-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        tasks.forEach(task => {
            const user = users.find(u => u.id === task.assigneeId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="task-id">#${task.id}</td>
                <td class="task-title">${task.title}</td>
                <td class="task-description" title="${task.description}">${task.description}</td>
                <td class="task-status">
                    <span class="status-badge status-${task.status}">${this.getStatusText(task.status)}</span>
                </td>
                <td class="task-priority">
                    <span class="priority-badge priority-${task.priority}">${this.getPriorityText(task.priority)}</span>
                </td>
                <td class="task-assignee">${user ? user.name : 'Не назначен'}</td>
                <td class="task-deadline">
                    <span class="deadline-badge ${this.getDeadlineClass(task.deadline)}">${Utils.formatDate(task.deadline)}</span>
                </td>
                <td class="task-tags">
                    <div class="tags-cell">
                        ${task.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                    </div>
                </td>
                <td class="task-actions">
                    <div class="action-buttons">
                        <button class="action-btn" onclick="app.editTask('${task.id}')" title="Редактировать">✏️</button>
                        <button class="action-btn" onclick="app.deleteTask('${task.id}')" title="Удалить">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    renderListView(tasks, users) {
        const listContainer = document.getElementById('tasks-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        tasks.forEach(task => {
            const user = users.find(u => u.id === task.assigneeId);
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="task-id">#${task.id}</div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-meta">
                        <div class="task-status">
                            <span class="status-badge status-${task.status}">${this.getStatusText(task.status)}</span>
                        </div>
                        <div class="task-priority">
                            <span class="priority-badge priority-${task.priority}">${this.getPriorityText(task.priority)}</span>
                        </div>
                        <div class="task-assignee">👤 ${user ? user.name : 'Не назначен'}</div>
                        <div class="task-deadline">
                            <span class="deadline-badge ${this.getDeadlineClass(task.deadline)}">📅 ${Utils.formatDate(task.deadline)}</span>
                        </div>
                        <div class="task-tags">
                            ${task.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn" onclick="app.editTask('${task.id}')" title="Редактировать">✏️</button>
                    <button class="action-btn" onclick="app.deleteTask('${task.id}')" title="Удалить">🗑️</button>
                </div>
            `;
            listContainer.appendChild(item);
        });
    }
    
    getStatusText(status) {
        const statusMap = {
            'new': 'Новая',
            'in-progress': 'В работе',
            'review': 'На проверке',
            'done': 'Выполнено'
        };
        return statusMap[status] || status;
    }
    
    getPriorityText(priority) {
        const priorityMap = {
            'low': 'Низкий',
            'medium': 'Средний',
            'high': 'Высокий',
            'critical': 'Критический'
        };
        return priorityMap[priority] || priority;
    }
    
    getDeadlineClass(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'deadline-danger';
        if (diffDays <= 2) return 'deadline-warning';
        return 'deadline-ok';
    }
    
    createTaskElement(task, users) {
        const user = users.find(u => u.id === task.assigneeId);
        const deadlineClass = this.getDeadlineClass(task.deadline);
        const priorityClass = `priority-${task.priority}`;
        const deadlineText = Utils.formatDate(task.deadline);
        
        const tags = task.tags ? task.tags.map(tag => 
            `<span class="task-tag">${tag}</span>`
        ).join('') : '';
        
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.dataset.taskId = task.id;
        taskElement.draggable = true;
        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <span class="task-priority ${priorityClass}">
                    ${this.getPriorityText(task.priority)}
                </span>
            </div>
            <div class="task-description">${task.description}</div>
            <div class="task-meta">
                <span class="task-assignee">👤 ${user ? user.name : 'Не назначено'}</span>
                <span class="task-deadline ${deadlineClass}">${deadlineText}</span>
            </div>
            ${tags ? `<div class="task-tags">${tags}</div>` : ''}
        `;
        
        // Добавляем обработчик двойного клика
        taskElement.addEventListener('dblclick', () => {
            this.editTask(task.id);
        });
        
        return taskElement;
    }
    
    renderInfoView(tasks, users) {
        const tableBody = document.getElementById('info-table-body');
        const totalElement = document.getElementById('info-total');
        const activeElement = document.getElementById('info-active');
        const doneElement = document.getElementById('info-done');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Подсчет статистики
        const total = tasks.length;
        const active = tasks.filter(task => task.status !== 'done').length;
        const done = tasks.filter(task => task.status === 'done').length;
        
        // Обновление статистики
        if (totalElement) totalElement.textContent = total;
        if (activeElement) activeElement.textContent = active;
        if (doneElement) doneElement.textContent = done;
        
        // Рендеринг задач в таблице
        tasks.forEach(task => {
            const user = users.find(u => u.id === task.assigneeId);
            const row = document.createElement('tr');
            row.dataset.taskId = task.id;
            
            // Обрезка текста для компактности
            const title = task.title.length > 40 ? task.title.substring(0, 40) + '...' : task.title;
            const description = task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description;
            const assigneeName = user ? (user.name.length > 15 ? user.name.substring(0, 15) + '...' : user.name) : 'Не назначен';
            
            row.innerHTML = `
                <td class="info-col-id-status">
                    <div class="info-id-status">
                        <span class="info-id">#${task.id}</span>
                        <span class="info-status status-${task.status}">${this.getStatusText(task.status)}</span>
                    </div>
                </td>
                <td class="info-col-title-desc">
                    <div class="info-title-desc">
                        <div class="info-title" title="${task.title}">${title}</div>
                        <div class="info-description" title="${task.description}">${description}</div>
                    </div>
                </td>
                <td class="info-col-assignee-deadline">
                    <div class="info-assignee-deadline">
                        <div class="info-assignee" title="${user ? user.name : 'Не назначен'}">👤 ${assigneeName}</div>
                        <div class="info-deadline ${this.getDeadlineClass(task.deadline)}" title="${Utils.formatDate(task.deadline)}">📅 ${Utils.formatDate(task.deadline)}</div>
                    </div>
                </td>
                <td class="info-col-tags">
                    <div class="info-tags">
                        ${task.tags && task.tags.length > 0 ? 
                            task.tags.slice(0, 3).map(tag => `<span class="info-tag">${tag}</span>`).join('') +
                            (task.tags.length > 3 ? `<span class="info-tag">+${task.tags.length - 3}</span>` : '')
                            : '<span class="info-tag" style="opacity: 0.5;">—</span>'
                        }
                    </div>
                </td>
                <td class="info-col-priority">
                    <div class="info-priority">
                        <div class="priority-indicator priority-indicator-${task.priority}" title="${this.getPriorityText(task.priority)}"></div>
                    </div>
                </td>
            `;
            
            // Добавляем обработчики событий
            row.addEventListener('click', () => {
                this.editTask(task.id);
            });
            
            row.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showTaskContextMenu(e, task.id);
            });
            
            tableBody.appendChild(row);
        });
    }
    
    showTaskContextMenu(event, taskId) {
        // Простое контекстное меню
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 1000;
            padding: 4px;
        `;
        
        menu.innerHTML = `
            <button class="action-btn" onclick="app.editTask('${taskId}')" style="width: 100%; margin: 2px 0;">✏️ Редактировать</button>
            <button class="action-btn" onclick="app.deleteTask('${taskId}')" style="width: 100%; margin: 2px 0;">🗑️ Удалить</button>
        `;
        
        document.body.appendChild(menu);
        
        // Удаляем меню при клике вне его
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            });
        }, 100);
    }
    
    renderAnalytics() {
        try {
            const stats = Utils.calculateTaskStats(this.tasks);
            
            // Обновляем метрики
            const completedEl = document.getElementById('metric-completed');
            const overdueEl = document.getElementById('metric-overdue');
            const completionEl = document.getElementById('metric-completion');
            const activeEl = document.getElementById('metric-active');
            
            if (completedEl) completedEl.textContent = stats.done;
            if (overdueEl) overdueEl.textContent = stats.overdue;
            if (completionEl) completionEl.textContent = `${stats.completionRate}%`;
            if (activeEl) activeEl.textContent = this.users.filter(u => u.isActive).length;
            
            // Рендерим графики
            this.renderCharts();
        } catch (error) {
            console.warn('Ошибка рендеринга аналитики:', error);
        }
    }
    
    renderCharts() {
        try {
            const statusChart = document.getElementById('status-chart');
            const teamChart = document.getElementById('team-chart');
            
            if (statusChart) {
                this.renderStatusChart(statusChart);
            }
            
            if (teamChart) {
                this.renderTeamChart(teamChart);
            }
        } catch (error) {
            console.warn('Ошибка рендеринга графиков:', error);
        }
    }
    
    renderStatusChart(canvas) {
        try {
            const data = charts.createTaskStatusData(this.tasks);
            charts.drawPieChart(canvas, data, {
                colors: ['#667eea', '#764ba2', '#f093fb', '#4caf50'],
                showLegend: true,
                showCenter: true
            });
        } catch (error) {
            console.warn('Ошибка рендеринга графика статусов:', error);
        }
    }
    
    renderTeamChart(canvas) {
        try {
            const data = charts.createUserWorkloadData(this.users, this.tasks);
            charts.drawBarChart(canvas, data, {
                colors: ['#667eea', '#764ba2', '#f093fb', '#4caf50', '#20b2aa', '#ff9800', '#f44336', '#2196f3']
            });
        } catch (error) {
            console.warn('Ошибка рендеринга графика команды:', error);
        }
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
    
    deleteTask(taskId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            storage.deleteTask(taskId);
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.renderTasks();
            Utils.showNotification('Задача удалена', 'success');
        }
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
    // Рендерим задачи после инициализации
    setTimeout(() => {
        // Устанавливаем правильный вид отображения
        Utils.updateViewMode(Utils.getViewMode());
        window.app.renderTasks();
    }, 100);
});
