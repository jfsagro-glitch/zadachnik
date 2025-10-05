/**
 * ЗАДАЧНИК - Компактная табличная система управления задачами
 */

class ZadachnikApp {
    constructor() {
        this.tasks = [];
        this.users = [];
        this.filteredTasks = [];
        this.sortColumn = 'id';
        this.sortDirection = 'asc';
        this.currentTaskId = null;
        
        this.init();
    }
    
    init() {
        // Загружаем данные из localStorage или используем демо-данные
        this.loadData();
        
        // Заполняем фильтр исполнителей
        this.populateAssigneeFilter();
        
        // Рендерим таблицу
        this.applyFilters();
        
        // Заполняем select исполнителей в форме
        this.populateAssigneeSelect();
    }
    
    loadData() {
        const savedTasks = localStorage.getItem('zadachnik_tasks');
        const savedUsers = localStorage.getItem('zadachnik_users');
        
        if (savedTasks && savedUsers) {
            this.tasks = JSON.parse(savedTasks);
            this.users = JSON.parse(savedUsers);
        } else {
            // Используем демо-данные
            this.tasks = DemoData.tasks;
            this.users = DemoData.users;
            this.saveData();
        }
    }
    
    saveData() {
        localStorage.setItem('zadachnik_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('zadachnik_users', JSON.stringify(this.users));
    }
    
    populateAssigneeFilter() {
        const select = document.getElementById('filter-assignee');
        select.innerHTML = '<option value="">Все</option>';
        
        const uniqueAssignees = [...new Set(this.tasks.map(t => t.assignee))];
        uniqueAssignees.forEach(assignee => {
            const option = document.createElement('option');
            option.value = assignee;
            option.textContent = assignee;
            select.appendChild(option);
        });
    }
    
    populateAssigneeSelect() {
        const select = document.getElementById('task-assignee');
        select.innerHTML = '<option value="">Не назначен</option>';
        
        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.name;
            option.textContent = user.name;
            select.appendChild(option);
        });
    }
    
    applyFilters() {
        const searchText = document.getElementById('search-input').value.toLowerCase();
        const filterStatus = document.getElementById('filter-status').value;
        const filterPriority = document.getElementById('filter-priority').value;
        const filterAssignee = document.getElementById('filter-assignee').value;
        
        this.filteredTasks = this.tasks.filter(task => {
            // Поиск по всем полям
            const matchesSearch = !searchText || 
                task.id.toLowerCase().includes(searchText) ||
                task.title.toLowerCase().includes(searchText) ||
                task.assignee.toLowerCase().includes(searchText);
            
            // Фильтр по статусу
            const matchesStatus = !filterStatus || task.status === filterStatus;
            
            // Фильтр по приоритету
            const matchesPriority = !filterPriority || task.priority === filterPriority;
            
            // Фильтр по исполнителю
            const matchesAssignee = !filterAssignee || task.assignee === filterAssignee;
            
            return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
        });
        
        // Сортировка
        this.sortTasks();
        
        // Рендерим таблицу
        this.renderTable();
        
        // Обновляем счетчики
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
            
            // Обработка разных типов данных
            if (this.sortColumn === 'workload') {
                aVal = parseInt(aVal);
                bVal = parseInt(bVal);
            }
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    renderTable() {
        const tbody = document.getElementById('tasks-tbody');
        tbody.innerHTML = '';
        
        this.filteredTasks.forEach(task => {
            const row = this.createTableRow(task);
            tbody.appendChild(row);
        });
    }
    
    createTableRow(task) {
        const tr = document.createElement('tr');
        
        // ID
        const tdId = document.createElement('td');
        tdId.textContent = task.id;
        tr.appendChild(tdId);
        
        // Название
        const tdTitle = document.createElement('td');
        tdTitle.textContent = task.title;
        tdTitle.title = task.title;
        tr.appendChild(tdTitle);
        
        // Статус (с быстрым изменением)
        const tdStatus = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.className = 'status-select';
        statusSelect.innerHTML = `
            <option value="new" ${task.status === 'new' ? 'selected' : ''}>Новая</option>
            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>В работе</option>
            <option value="review" ${task.status === 'review' ? 'selected' : ''}>На проверке</option>
            <option value="done" ${task.status === 'done' ? 'selected' : ''}>Завершена</option>
            <option value="paused" ${task.status === 'paused' ? 'selected' : ''}>Приостановлена</option>
        `;
        statusSelect.onchange = (e) => this.quickUpdateStatus(task.id, e.target.value);
        tdStatus.appendChild(statusSelect);
        tr.appendChild(tdStatus);
        
        // Приоритет
        const tdPriority = document.createElement('td');
        tdPriority.innerHTML = `<span class="priority-badge priority-${task.priority}">${this.getPriorityText(task.priority)}</span>`;
        tr.appendChild(tdPriority);
        
        // Исполнитель
        const tdAssignee = document.createElement('td');
        tdAssignee.textContent = task.assignee;
        tr.appendChild(tdAssignee);
        
        // Срок
        const tdDeadline = document.createElement('td');
        const deadlineClass = this.getDeadlineClass(task.deadline);
        tdDeadline.className = deadlineClass;
        tdDeadline.textContent = this.formatDate(task.deadline);
        tr.appendChild(tdDeadline);
        
        // Загрузка
        const tdWorkload = document.createElement('td');
        tdWorkload.innerHTML = this.createWorkloadBar(task.workload);
        tr.appendChild(tdWorkload);
        
        // Действия
        const tdActions = document.createElement('td');
        tdActions.innerHTML = `
            <div class="actions-cell">
                <button class="btn btn-sm btn-primary" onclick="app.editTask('${task.id}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="app.deleteTask('${task.id}')">🗑️</button>
            </div>
        `;
        tr.appendChild(tdActions);
        
        return tr;
    }
    
    createWorkloadBar(workload) {
        let fillClass = '';
        if (workload >= 80) fillClass = 'critical';
        else if (workload >= 60) fillClass = 'high';
        
        return `
            <div class="workload-bar">
                <div class="workload-progress">
                    <div class="workload-fill ${fillClass}" style="width: ${workload}%"></div>
                </div>
                <span class="workload-text">${workload}%</span>
            </div>
        `;
    }
    
    getPriorityText(priority) {
        const map = {
            'low': 'Низкий',
            'medium': 'Средний',
            'high': 'Высокий',
            'critical': 'Критический'
        };
        return map[priority] || priority;
    }
    
    getDeadlineClass(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'deadline-danger';
        if (diffDays <= 3) return 'deadline-warning';
        return 'deadline-ok';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
    
    quickUpdateStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            this.saveData();
            this.applyFilters();
        }
    }
    
    updateStats() {
        document.getElementById('visible-count').textContent = this.filteredTasks.length;
        document.getElementById('total-count').textContent = this.tasks.length;
    }
    
    resetFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-priority').value = '';
        document.getElementById('filter-assignee').value = '';
        this.applyFilters();
    }
    
    addTask() {
        this.currentTaskId = null;
        document.getElementById('modal-title').textContent = 'Новая задача';
        document.getElementById('task-form').reset();
        document.getElementById('task-id').value = '';
        
        // Генерируем новый ID
        const maxId = this.tasks.length > 0 
            ? Math.max(...this.tasks.map(t => parseInt(t.id.split('-')[1]))) 
            : 0;
        document.getElementById('task-id').value = `T-${String(maxId + 1).padStart(3, '0')}`;
        
        document.getElementById('task-modal').classList.add('active');
    }
    
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        this.currentTaskId = taskId;
        document.getElementById('modal-title').textContent = 'Редактировать задачу';
        
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-assignee').value = task.assignee;
        document.getElementById('task-deadline').value = task.deadline;
        document.getElementById('task-workload').value = task.workload;
        
        document.getElementById('task-modal').classList.add('active');
    }
    
    saveTask(event) {
        event.preventDefault();
        
        const taskData = {
            id: document.getElementById('task-id').value,
            title: document.getElementById('task-title').value,
            status: document.getElementById('task-status').value,
            priority: document.getElementById('task-priority').value,
            assignee: document.getElementById('task-assignee').value,
            deadline: document.getElementById('task-deadline').value,
            workload: parseInt(document.getElementById('task-workload').value)
        };
        
        if (this.currentTaskId) {
            // Обновляем существующую задачу
            const index = this.tasks.findIndex(t => t.id === this.currentTaskId);
            if (index !== -1) {
                this.tasks[index] = taskData;
            }
        } else {
            // Добавляем новую задачу
            this.tasks.push(taskData);
        }
        
        this.saveData();
        this.closeModal();
        this.applyFilters();
        this.populateAssigneeFilter();
    }
    
    deleteTask(taskId) {
        if (confirm('Удалить задачу?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveData();
            this.applyFilters();
        }
    }
    
    closeModal() {
        document.getElementById('task-modal').classList.remove('active');
    }
    
    showFreeHands() {
        const modal = document.getElementById('free-hands-modal');
        const content = document.getElementById('free-hands-content');
        
        // Рассчитываем загрузку каждого исполнителя
        const workloadByUser = {};
        this.tasks.forEach(task => {
            if (task.status !== 'done' && task.assignee) {
                if (!workloadByUser[task.assignee]) {
                    workloadByUser[task.assignee] = 0;
                }
                workloadByUser[task.assignee] += task.workload;
            }
        });
        
        // Находим свободных исполнителей (загрузка < 100%)
        const freeUsers = this.users.filter(user => {
            const workload = workloadByUser[user.name] || 0;
            return workload < 100;
        }).map(user => ({
            ...user,
            workload: workloadByUser[user.name] || 0,
            available: 100 - (workloadByUser[user.name] || 0)
        })).sort((a, b) => b.available - a.available);
        
        if (freeUsers.length === 0) {
            content.innerHTML = '<div class="free-hands-list"><p>Нет свободных исполнителей</p></div>';
        } else {
            content.innerHTML = `
                <div class="free-hands-list">
                    ${freeUsers.map(user => `
                        <div class="free-hand-item">
                            <div class="user-info">
                                <div class="user-name">${user.name}</div>
                                <div class="user-role">Исполнитель</div>
                            </div>
                            <div class="user-workload">
                                Свободно: ${user.available}%
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        modal.classList.add('active');
    }
    
    closeFreeHandsModal() {
        document.getElementById('free-hands-modal').classList.remove('active');
    }
    
    exportToCSV() {
        const headers = ['ID', 'Название', 'Статус', 'Приоритет', 'Исполнитель', 'Срок', 'Загрузка'];
        const rows = this.filteredTasks.map(task => [
            task.id,
            task.title,
            task.status,
            task.priority,
            task.assignee,
            task.deadline,
            task.workload
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
    app = new ZadachnikApp();
});

// Закрытие модальных окон по клику вне их
window.onclick = function(event) {
    const taskModal = document.getElementById('task-modal');
    const freeHandsModal = document.getElementById('free-hands-modal');
    
    if (event.target === taskModal) {
        app.closeModal();
    }
    if (event.target === freeHandsModal) {
        app.closeFreeHandsModal();
    }
};