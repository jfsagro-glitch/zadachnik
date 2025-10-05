/**
 * ЗАДАЧНИК - Главное приложение с ролевой моделью и workflow
 */

class ZadachnikApp {
    constructor() {
        console.log('ZadachnikApp constructor called');
        
        // Инициализация менеджеров
        this.storage = new StorageManager();
        this.auth = new AuthManager();
        this.workflow = new WorkflowManager(this.auth);
        this.analytics = new AnalyticsManager(this.auth);
        
        console.log('Managers initialized');
        
        // Состояние приложения
        this.tasks = [];
        this.users = {};
        this.filteredTasks = [];
        this.sortColumn = 'id';
        this.sortDirection = 'asc';
        this.currentTask = null;
        this.pendingAction = null;
        this.allEmployees = [];
        
        this.init();
    }
    
    init() {
        // Инициализация демо-данных
        this.storage.initDemoData();
        
        // Загрузка данных
        this.loadData();
        
        // Настройка UI
        this.setupUI();
        
        // Применение фильтров и рендеринг
        this.applyFilters();
    }
    
    loadData() {
        this.tasks = this.storage.getTasks();
        const usersData = this.storage.getUsers();
        this.users = usersData || (window.DemoData ? DemoData.users : {});
        if (!usersData && window.DemoData) {
            this.storage.saveUsers(this.users);
        }
    }
    
    setupUI() {
        this.updateUserInfo();
        this.populateFilters();
        this.updateUIForRole();
    }
    
    updateUserInfo() {
        const user = this.auth.getCurrentUser();
        document.getElementById('current-user-name').textContent = user.name;
        document.getElementById('role-select').value = user.role;
        if (user.region) {
            document.getElementById('region-select').value = user.region;
            document.getElementById('region-select').style.display = 'inline-block';
        } else {
            document.getElementById('region-select').style.display = 'none';
        }
    }
    
    updateUIForRole() {
        document.getElementById('btn-create-task').style.display = 
            this.auth.hasPermission('createTask') ? 'inline-block' : 'none';
        document.getElementById('btn-analytics').style.display = 
            (this.auth.hasPermission('viewAnalytics') || this.auth.hasPermission('viewAllAnalytics')) ? 'inline-block' : 'none';
        document.getElementById('filter-region-group').style.display = 
            this.auth.getCurrentRole() === 'superuser' ? 'block' : 'none';
    }
    
    populateFilters() {
        const filterRegion = document.getElementById('filter-region');
        filterRegion.innerHTML = '<option value="">Все</option>';
        this.auth.getAllRegions().forEach(region => {
            filterRegion.innerHTML += `<option value="${region}">${region}</option>`;
        });
    }
    
    switchRole() {
        const role = document.getElementById('role-select').value;
        const region = document.getElementById('region-select').value;
        this.auth.switchRole(role, region);
        this.updateUserInfo();
        this.updateUIForRole();
        this.applyFilters();
    }
    
    switchRegion() {
        const region = document.getElementById('region-select').value;
        const user = this.auth.getCurrentUser();
        user.region = region;
        this.auth.saveCurrentUser();
        this.applyFilters();
    }
    
    applyFilters() {
        const searchText = document.getElementById('search-input').value.toLowerCase();
        const filterRegion = document.getElementById('filter-region').value;
        const filterType = document.getElementById('filter-type').value;
        const filterStatus = document.getElementById('filter-status').value;
        const filterPriority = document.getElementById('filter-priority').value;
        
        this.filteredTasks = this.tasks.filter(task => {
            if (!this.auth.canViewTask(task)) return false;
            
            const matchesSearch = !searchText || 
                task.id.toLowerCase().includes(searchText) ||
                task.title.toLowerCase().includes(searchText) ||
                (task.currentAssignee && task.currentAssignee.toLowerCase().includes(searchText));
            
            const matchesRegion = !filterRegion || task.region === filterRegion;
            const matchesType = !filterType || task.type === filterType;
            const matchesStatus = !filterStatus || task.status === filterStatus;
            const matchesPriority = !filterPriority || task.priority === filterPriority;
            
            return matchesSearch && matchesRegion && matchesType && matchesStatus && matchesPriority;
        });
        
        this.sortTasks();
        this.renderTable();
        this.updateStats();
    }
    
    sortBy(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.applyFilters();
    }
    
    sortTasks() {
        this.filteredTasks.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    resetFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-region').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-priority').value = '';
        this.applyFilters();
    }
    
    updateStats() {
        document.getElementById('visible-count').textContent = this.filteredTasks.length;
        document.getElementById('total-count').textContent = this.tasks.length;
    }
    
    renderTable() {
        const tbody = document.getElementById('tasks-tbody');
        tbody.innerHTML = '';
        this.filteredTasks.forEach(task => tbody.appendChild(this.createTableRow(task)));
    }
    
    createTableRow(task) {
        const tr = document.createElement('tr');
        const statusInfo = this.workflow.getStatusInfo(task.status);
        
        tr.innerHTML = `
            <td onclick="app.openTaskCard('${task.id}')" style="cursor:pointer">${task.id}</td>
            <td>${task.region}</td>
            <td>${task.type}</td>
            <td onclick="app.openTaskCard('${task.id}')" style="cursor:pointer" title="${task.title}">${task.title}</td>
            <td><span class="priority-badge priority-${task.priority}">${this.getPriorityText(task.priority)}</span></td>
            <td><span class="${this.getDeadlineClass(task.dueDate)}">${this.formatDate(task.dueDate)}</span></td>
            <td><span class="status-badge status-${task.status}">${statusInfo.label}</span></td>
            <td>${this.getAssigneeName(task.currentAssignee) || '-'}</td>
            <td>${this.renderActions(task)}</td>
        `;
        return tr;
    }
    
    renderActions(task) {
        const actions = this.auth.getAvailableActions(task);
        return actions.slice(0, 3).map(action => 
            `<button class="btn btn-sm btn-secondary" onclick="app.handleAction('${task.id}', '${action.id}')" title="${action.label}">${action.icon}</button>`
        ).join(' ');
    }
    
    getPriorityText(priority) {
        return { low: 'Низкий', medium: 'Средний', high: 'Высокий', critical: 'Критический' }[priority] || priority;
    }
    
    getDeadlineClass(deadline) {
        const diffDays = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'deadline-danger';
        if (diffDays <= 3) return 'deadline-warning';
        return 'deadline-ok';
    }
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
    
    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
    
    getAssigneeName(email) {
        if (!email) return null;
        for (const role in this.users) {
            const user = this.users[role].find(u => u.email === email);
            if (user) return user.name;
        }
        return email;
    }
    
    createNewTask() {
        this.currentTask = null;
        document.getElementById('modal-title').textContent = 'Новая задача';
        document.getElementById('task-form').reset();
        const user = this.auth.getCurrentUser();
        if (user.region) document.getElementById('task-region').value = user.region;
        
        document.getElementById('documents-list').innerHTML = '<p style="color:#999;font-size:12px;">Нет документов</p>';
        document.getElementById('comments-list').innerHTML = '<p style="color:#999;font-size:12px;">Нет комментариев</p>';
        document.getElementById('history-list').innerHTML = '<p style="color:#999;font-size:12px;">История пуста</p>';
        document.getElementById('assignees-group').style.display = 'none';
        document.getElementById('workflow-actions').innerHTML = '';
        document.getElementById('task-modal').classList.add('active');
    }
    
    openTaskCard(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        this.currentTask = task;
        document.getElementById('modal-title').textContent = `Задача ${task.id}`;
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-region').value = task.region;
        document.getElementById('task-type').value = task.type;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-deadline').value = task.dueDate;
        
        const canEdit = this.auth.canEditTask(task);
        ['task-title', 'task-description', 'task-priority', 'task-deadline'].forEach(id => {
            document.getElementById(id).disabled = !canEdit;
        });
        document.getElementById('btn-save-task').style.display = canEdit ? 'inline-block' : 'none';
        
        this.renderAssignees(task);
        this.renderDocuments(task);
        this.renderComments(task);
        this.renderHistory(task);
        this.renderWorkflowActions(task);
        document.getElementById('task-modal').classList.add('active');
    }
    
    renderAssignees(task) {
        const assigneesGroup = document.getElementById('assignees-group');
        const assigneesList = document.getElementById('assignees-list');
        
        if (this.auth.hasPermission('assignTasks')) {
            assigneesGroup.style.display = 'block';
            
            // Получаем список сотрудников
            let employeesList = [];
            if (Array.isArray(this.users)) {
                employeesList = this.users.filter(u => u.role === 'employee');
            } else if (this.users.employee && Array.isArray(this.users.employee)) {
                employeesList = this.users.employee;
            }
            
            const employees = employeesList.filter(e => e.region === task.region);
            assigneesList.innerHTML = employees.map(emp => `
                <div class="assignee-item">
                    <input type="checkbox" id="emp-${emp.id}" value="${emp.email}" ${task.assignedTo && task.assignedTo.includes(emp.email) ? 'checked' : ''}>
                    <label for="emp-${emp.id}">${emp.name}</label>
                </div>
            `).join('');
        } else {
            assigneesGroup.style.display = 'none';
        }
    }
    
    renderDocuments(task) {
        const docsList = document.getElementById('documents-list');
        if (task.documents && task.documents.length > 0) {
            docsList.innerHTML = task.documents.map(doc => `
                <div class="document-item">
                    <div class="document-info">
                        <div class="document-name">📎 ${doc.name}</div>
                        <div class="document-meta">Загрузил: ${doc.uploadedByName} • ${this.formatDateTime(doc.uploadedAt)}</div>
                    </div>
                </div>
            `).join('');
        } else {
            docsList.innerHTML = '<p style="color:#999;font-size:12px;">Нет документов</p>';
        }
    }
    
    renderComments(task) {
        const commentsList = document.getElementById('comments-list');
        if (task.comments && task.comments.length > 0) {
            commentsList.innerHTML = task.comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${this.formatDateTime(comment.createdAt)}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            `).join('');
        } else {
            commentsList.innerHTML = '<p style="color:#999;font-size:12px;">Нет комментариев</p>';
        }
    }
    
    renderHistory(task) {
        const historyList = document.getElementById('history-list');
        if (task.history && task.history.length > 0) {
            historyList.innerHTML = task.history.map(item => `
                <div class="history-item action-${item.status}">
                    <div class="history-header">
                        <span class="history-user">${item.user}</span>
                        <span class="history-date">${this.formatDateTime(item.date)}</span>
                    </div>
                    <div class="history-action">${item.action}</div>
                    ${item.comment ? `<div class="history-comment">${item.comment}</div>` : ''}
                </div>
            `).join('');
        } else {
            historyList.innerHTML = '<p style="color:#999;font-size:12px;">История пуста</p>';
        }
    }
    
    renderWorkflowActions(task) {
        const workflowActions = document.getElementById('workflow-actions');
        const actions = this.auth.getAvailableActions(task);
        
        if (actions.length > 0) {
            workflowActions.innerHTML = actions.map(action => {
                const btnClass = `workflow-btn workflow-btn-${action.id}`;
                return `<button class="${btnClass}" onclick="app.handleAction('${task.id}', '${action.id}')">${action.label}</button>`;
            }).join('');
        } else {
            workflowActions.innerHTML = '';
        }
    }
    
    handleAction(taskId, actionId) {
        console.log('handleAction called:', taskId, actionId);
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) {
            console.error('Task not found:', taskId);
            return;
        }
        
        console.log('Task found:', task);
        
        // Для распределения открываем специальное модальное окно
        if (actionId === 'assign') {
            console.log('Opening assign modal');
            this.showAssignModal(task);
            return;
        }
        
        const needsComment = ['pause', 'rework', 'return'].includes(actionId);
        
        if (needsComment) {
            this.pendingAction = { taskId, actionId };
            document.getElementById('action-modal-title').textContent = this.getActionTitle(actionId);
            document.getElementById('action-comment').value = '';
            document.getElementById('action-modal').classList.add('active');
        } else {
            this.executeAction(taskId, actionId, '');
        }
    }
    
    getActionTitle(actionId) {
        const titles = {
            pause: 'Постановка на паузу',
            rework: 'Отправка на доработку',
            return: 'Возврат задачи',
            approve: 'Согласование задачи',
            assign: 'Распределение задачи'
        };
        return titles[actionId] || 'Действие';
    }
    
    confirmAction() {
        if (!this.pendingAction) return;
        const comment = document.getElementById('action-comment').value;
        if (!comment.trim()) {
            alert('Требуется комментарий');
            return;
        }
        this.executeAction(this.pendingAction.taskId, this.pendingAction.actionId, comment);
        this.closeActionModal();
    }
    
    executeAction(taskId, actionId, comment) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        try {
            let updatedTask;
            switch(actionId) {
                case 'accept':
                    updatedTask = this.workflow.acceptTask(task, comment);
                    break;
                case 'pause':
                    updatedTask = this.workflow.pauseTask(task, comment);
                    break;
                case 'resume':
                    updatedTask = this.workflow.resumeTask(task, comment);
                    break;
                case 'rework':
                    updatedTask = this.workflow.sendToRework(task, comment);
                    break;
                case 'returnToWork':
                    updatedTask = this.workflow.returnToWork(task, comment);
                    break;
                case 'approval':
                    updatedTask = this.workflow.sendToApproval(task, comment);
                    break;
                case 'approve':
                    updatedTask = this.workflow.approveTask(task, comment);
                    break;
                case 'return':
                    updatedTask = this.workflow.returnToEmployee(task, comment);
                    break;
                case 'assign':
                    const selectedEmployees = Array.from(document.querySelectorAll('#assignees-list input:checked')).map(cb => cb.value);
                    if (selectedEmployees.length === 0) {
                        alert('Выберите исполнителей');
                        return;
                    }
                    updatedTask = this.workflow.assignTask(task, selectedEmployees, comment);
                    break;
                default:
                    return;
            }
            
            const index = this.tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
                this.storage.saveTasks(this.tasks);
                this.applyFilters();
                if (this.currentTask && this.currentTask.id === taskId) {
                    this.openTaskCard(taskId);
                }
            }
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    }
    
    saveTask(event) {
        event.preventDefault();
        
        const taskData = {
            id: document.getElementById('task-id').value,
            region: document.getElementById('task-region').value,
            type: document.getElementById('task-type').value,
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-deadline').value
        };
        
        if (this.currentTask) {
            // Обновление существующей задачи
            Object.assign(this.currentTask, taskData);
            this.currentTask.updatedAt = new Date().toISOString();
            const index = this.tasks.findIndex(t => t.id === this.currentTask.id);
            if (index !== -1) {
                this.tasks[index] = this.currentTask;
            }
        } else {
            // Создание новой задачи
            const newTask = this.workflow.createTask(taskData);
            this.tasks.push(newTask);
        }
        
        this.storage.saveTasks(this.tasks);
        this.closeTaskModal();
        this.applyFilters();
    }
    
    addComment() {
        const commentText = document.getElementById('new-comment').value.trim();
        if (!commentText || !this.currentTask) return;
        
        this.workflow.addComment(this.currentTask, commentText);
        const index = this.tasks.findIndex(t => t.id === this.currentTask.id);
        if (index !== -1) {
            this.tasks[index] = this.currentTask;
            this.storage.saveTasks(this.tasks);
        }
        
        document.getElementById('new-comment').value = '';
        this.renderComments(this.currentTask);
        this.renderHistory(this.currentTask);
    }
    
    attachDocument() {
        document.getElementById('file-input').click();
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file || !this.currentTask) return;
        
        const document = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: '#'
        };
        
        this.workflow.attachDocument(this.currentTask, document);
        const index = this.tasks.findIndex(t => t.id === this.currentTask.id);
        if (index !== -1) {
            this.tasks[index] = this.currentTask;
            this.storage.saveTasks(this.tasks);
        }
        
        this.renderDocuments(this.currentTask);
        this.renderHistory(this.currentTask);
    }
    
    showAnalytics() {
        const user = this.auth.getCurrentUser();
        const region = user.role === 'superuser' ? null : user.region;
        
        // Получаем список сотрудников
        let employeesList = [];
        if (Array.isArray(this.users)) {
            employeesList = this.users.filter(u => u.role === 'employee');
        } else if (this.users.employee && Array.isArray(this.users.employee)) {
            employeesList = this.users.employee;
        }
        
        const employees = region ? employeesList.filter(e => e.region === region) : employeesList;
        
        const analyticsData = this.analytics.exportAnalytics(this.tasks, employees, region);
        
        const content = document.getElementById('analytics-content');
        content.innerHTML = `
            <div class="analytics-section">
                <h3>KPI Показатели</h3>
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-label">Процент выполнения</div>
                        <div class="kpi-value">${analyticsData.kpi.completionRate}%</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Выполнено в срок</div>
                        <div class="kpi-value">${analyticsData.kpi.onTimeRate}%</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Качество</div>
                        <div class="kpi-value">${analyticsData.kpi.qualityScore}%</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Производительность</div>
                        <div class="kpi-value">${analyticsData.kpi.productivity}%</div>
                    </div>
                </div>
            </div>
            
            <div class="analytics-section">
                <h3>Статистика по сотрудникам</h3>
                <div class="employee-stats-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Сотрудник</th>
                                <th>Всего задач</th>
                                <th>Завершено</th>
                                <th>В работе</th>
                                <th>Загрузка</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.values(analyticsData.employees).map(emp => `
                                <tr>
                                    <td>${emp.name}</td>
                                    <td>${emp.totalTasks}</td>
                                    <td>${emp.completed}</td>
                                    <td>${emp.inProgress}</td>
                                    <td>
                                        <div class="workload-indicator">
                                            <div class="workload-fill ${emp.workload > 70 ? 'high' : emp.workload > 40 ? 'medium' : ''}" style="width: ${emp.workload}%"></div>
                                        </div>
                                        ${emp.workload}%
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.getElementById('analytics-modal').classList.add('active');
    }
    
    closeTaskModal() {
        document.getElementById('task-modal').classList.remove('active');
    }
    
    closeAnalyticsModal() {
        document.getElementById('analytics-modal').classList.remove('active');
    }
    
    closeActionModal() {
        document.getElementById('action-modal').classList.remove('active');
        this.pendingAction = null;
    }
    
    // Модальное окно распределения задачи
    showAssignModal(task) {
        console.log('showAssignModal called with task:', task);
        this.currentTask = task;
        
        // Заполняем информацию о задаче
        const taskInfo = document.getElementById('assign-task-info');
        if (!taskInfo) {
            console.error('assign-task-info element not found!');
            return;
        }
        
        taskInfo.innerHTML = `
            <h4>${task.id}: ${task.title}</h4>
            <p><strong>Регион:</strong> ${task.region}</p>
            <p><strong>Тип:</strong> ${task.type}</p>
            <p><strong>Описание:</strong> ${task.description || 'Нет описания'}</p>
        `;
        
        // Заполняем приоритет и срок текущими значениями
        document.getElementById('assign-priority').value = task.priority;
        document.getElementById('assign-deadline').value = task.dueDate;
        
        // Очищаем поиск и комментарий
        document.getElementById('employee-search').value = '';
        document.getElementById('assign-comment').value = '';
        
        // Загружаем сотрудников региона
        console.log('Loading employees for region:', task.region);
        this.loadEmployeesForAssign(task.region);
        
        const modal = document.getElementById('assign-modal');
        if (!modal) {
            console.error('assign-modal element not found!');
            return;
        }
        
        console.log('Opening assign modal');
        modal.classList.add('active');
    }
    
    loadEmployeesForAssign(region) {
        console.log('loadEmployeesForAssign - region:', region);
        console.log('All users:', this.users);
        
        // Проверяем структуру users
        let employeesList = [];
        if (Array.isArray(this.users)) {
            // Если users - массив, фильтруем по роли
            employeesList = this.users.filter(u => u.role === 'employee');
        } else if (this.users.employee && Array.isArray(this.users.employee)) {
            // Если users - объект с ключом employee
            employeesList = this.users.employee;
        } else {
            console.error('users.employee is undefined or not an array!');
            this.allEmployees = [];
            this.renderEmployeesSelect();
            this.renderEmployeesGrid();
            return;
        }
        
        const employees = employeesList.filter(e => e.region === region);
        console.log('Filtered employees for region:', employees.length);
        
        // Рассчитываем загрузку каждого сотрудника
        const workloadByUser = {};
        this.tasks.forEach(task => {
            if (task.status !== 'approved' && task.assignedTo) {
                task.assignedTo.forEach(empEmail => {
                    if (!workloadByUser[empEmail]) {
                        workloadByUser[empEmail] = 0;
                    }
                    // Условно: каждая активная задача = 20% загрузки
                    workloadByUser[empEmail] += 20;
                });
            }
        });
        
        this.allEmployees = employees.map(emp => ({
            ...emp,
            workload: Math.min(100, workloadByUser[emp.email] || 0),
            available: (workloadByUser[emp.email] || 0) < 80
        }));
        
        // Сортируем: сначала доступные, потом по имени
        this.allEmployees.sort((a, b) => {
            if (a.available !== b.available) {
                return a.available ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        
        console.log('All employees with workload:', this.allEmployees.length);
        this.renderEmployeesSelect();
        this.renderEmployeesGrid();
    }
    
    renderEmployeesSelect() {
        const select = document.getElementById('assign-employee-select');
        if (!select) return;
        
        const searchText = document.getElementById('employee-search').value.toLowerCase();
        
        const filteredEmployees = this.allEmployees.filter(emp => 
            emp.name.toLowerCase().includes(searchText) || 
            emp.email.toLowerCase().includes(searchText)
        );
        
        select.innerHTML = filteredEmployees.map(emp => {
            const statusIcon = emp.available ? '🟢' : '🔴';
            const workloadText = `${emp.workload}%`;
            return `<option value="${emp.email}">${statusIcon} ${emp.name} - Загрузка: ${workloadText}</option>`;
        }).join('');
    }
    
    filterEmployeesInSelect() {
        this.renderEmployeesSelect();
        this.renderEmployeesGrid();
    }
    
    renderEmployeesGrid() {
        const grid = document.getElementById('employees-grid');
        const searchText = document.getElementById('employee-search').value.toLowerCase();
        
        const filteredEmployees = this.allEmployees.filter(emp => 
            emp.name.toLowerCase().includes(searchText) || 
            emp.email.toLowerCase().includes(searchText)
        );
        
        if (filteredEmployees.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Сотрудники не найдены</p>';
            return;
        }
        
        grid.innerHTML = filteredEmployees.map(emp => {
            const workloadClass = emp.workload >= 80 ? 'high' : emp.workload >= 50 ? 'medium' : '';
            const statusClass = emp.available ? 'available' : 'busy';
            const statusText = emp.available ? 'Доступен' : 'Загружен';
            
            return `
                <div class="employee-card" onclick="app.selectEmployee('${emp.email}')">
                    <div class="employee-name">${emp.name}</div>
                    <div class="employee-email">${emp.email}</div>
                    <div class="employee-workload">
                        <div class="employee-workload-bar">
                            <div class="employee-workload-fill ${workloadClass}" style="width: ${emp.workload}%"></div>
                        </div>
                        <span class="employee-workload-text">${emp.workload}%</span>
                    </div>
                    <span class="employee-status ${statusClass}">${statusText}</span>
                </div>
            `;
        }).join('');
    }
    
    filterEmployees() {
        this.renderEmployeesGrid();
    }
    
    // Подтверждение распределения через кнопку
    confirmAssignment() {
        if (!this.currentTask) return;
        
        const employeeSelect = document.getElementById('assign-employee-select');
        const selectedEmail = employeeSelect.value;
        
        if (!selectedEmail) {
            alert('Выберите сотрудника из списка');
            return;
        }
        
        const employee = this.allEmployees.find(e => e.email === selectedEmail);
        if (!employee) {
            alert('Сотрудник не найден');
            return;
        }
        
        // Получаем обновленные значения
        const newPriority = document.getElementById('assign-priority').value;
        const newDeadline = document.getElementById('assign-deadline').value;
        const comment = document.getElementById('assign-comment').value.trim();
        
        if (confirm(`Распределить задачу "${this.currentTask.title}" на ${employee.name}?`)) {
            try {
                // Обновляем приоритет, если изменился
                if (newPriority !== this.currentTask.priority) {
                    this.workflow.changePriority(this.currentTask, newPriority, `Приоритет изменен при распределении`);
                }
                
                // Обновляем срок, если изменился
                if (newDeadline !== this.currentTask.dueDate) {
                    this.workflow.changeDeadline(this.currentTask, newDeadline, `Срок изменен при распределении`);
                }
                
                // Распределяем задачу
                const updatedTask = this.workflow.assignTask(
                    this.currentTask, 
                    [selectedEmail], 
                    comment || `Задача распределена на ${employee.name}`
                );
                
                const index = this.tasks.findIndex(t => t.id === this.currentTask.id);
                if (index !== -1) {
                    this.tasks[index] = updatedTask;
                    this.storage.saveTasks(this.tasks);
                    this.applyFilters();
                    this.closeAssignModal();
                    
                    alert(`✅ Задача успешно распределена на ${employee.name}`);
                }
            } catch (error) {
                alert('Ошибка: ' + error.message);
            }
        }
    }
    
    // Быстрое распределение по клику на карточку
    selectEmployee(employeeEmail) {
        if (!this.currentTask) return;
        
        const employee = this.allEmployees.find(e => e.email === employeeEmail);
        if (!employee) return;
        
        // Устанавливаем выбранного сотрудника в select
        document.getElementById('assign-employee-select').value = employeeEmail;
    }
    
    closeAssignModal() {
        document.getElementById('assign-modal').classList.remove('active');
        this.currentTask = null;
        this.allEmployees = [];
    }
    
    exportToCSV() {
        const headers = ['ID', 'Регион', 'Тип', 'Название', 'Приоритет', 'Срок', 'Статус', 'Исполнитель'];
        const rows = this.filteredTasks.map(task => [
            task.id, task.region, task.type, task.title, task.priority, 
            task.dueDate, task.status, this.getAssigneeName(task.currentAssignee) || '-'
        ]);
        
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });
        
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `zadachnik_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }
}

// Инициализация приложения
let app;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    try {
        app = new ZadachnikApp();
        window.app = app; // Делаем глобально доступным
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

// Закрытие модальных окон по клику вне их
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
};