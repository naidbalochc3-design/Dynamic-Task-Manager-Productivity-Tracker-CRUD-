// ========================================== */
// [APNI CUSTOM CHEEZ YAHAN DALEN]: DOM Elements Initialization
// ========================================== */
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskCategory = document.getElementById('taskCategory');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskStats = document.getElementById('taskStats');

// State Management Array (LocalStorage Sync)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize Application
function init() {
    renderTasks();
    taskForm.addEventListener('submit', addTask);
    
    // Filter buttons event listener
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderTasks();
        });
    });
}

// Save Tasks to Browser LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add Task Function (CREATE)
function addTask(e) {
    e.preventDefault();
    
    const newTask = {
        id: Date.now(),
        text: taskInput.value.trim(),
        category: taskCategory.value,
        dueDate: taskDate.value,
        completed: false
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();

    // Reset Form Inputs
    taskInput.value = '';
    taskDate.value = '';
}

// Toggle Task Completion Status (UPDATE)
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveToLocalStorage();
    renderTasks();
}

// Delete Task Function (DELETE)
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
}

// Render Tasks to DOM (READ & FILTER)
function renderTasks() {
    taskList.innerHTML = '';

    // Filter logic (All, Active, Completed)
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<li class="empty-state"><i class="fa-solid fa-box-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>No tasks found.</li>`;
        updateStats();
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <div class="task-details">
                    <span class="task-text">${escapeHTML(task.text)}</span>
                    <div class="task-meta">
                        <span class="badge">${task.category}</span>
                        <span><i class="fa-regular fa-calendar"></i> ${task.dueDate}</span>
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete Task"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateStats();
}

// Update Remaining Stats Counter
function updateStats() {
    const activeCount = tasks.filter(task => !task.completed).length;
    taskStats.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`;
}

// Security Helper: Escape HTML to prevent injection
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Run Application on Load
init();