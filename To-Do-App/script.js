document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const tasksLeft = document.getElementById('tasksLeft');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const storageTypeSelect = document.getElementById('storageType');

    let tasks = [];
    let currentFilter = 'all';
    let currentStorageType = 'local';

    // Initialize storage type and load tasks
    function initializeStorage() {
        currentStorageType = storageTypeSelect.value;
        loadTasks();
    }

    // Load tasks based on storage type
    function loadTasks() {
        switch (currentStorageType) {
            case 'local':
                tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                break;
            case 'session':
                tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
                break;
            case 'cookie':
                const cookieValue = getCookie('tasks');
                tasks = cookieValue ? JSON.parse(cookieValue) : [];
                break;
        }
        renderTasks();
    }

    // Save tasks based on storage type
    function saveTasks() {
        const tasksString = JSON.stringify(tasks);
        switch (currentStorageType) {
            case 'local':
                localStorage.setItem('tasks', tasksString);
                break;
            case 'session':
                sessionStorage.setItem('tasks', tasksString);
                break;
            case 'cookie':
                setCookie('tasks', tasksString, 30); // Cookie expires in 30 days
                break;
        }
    }

    // Cookie helper functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Add event listener for storage type change
    storageTypeSelect.addEventListener('change', () => {
        initializeStorage();
    });

    // Initialize storage on page load
    initializeStorage();

    // Add new task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            tasks.push(task);
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    }

    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <input type="text" class="edit-input" value="${task.text}" style="display: none;">
                </div>
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;

            const checkbox = taskItem.querySelector('.task-checkbox');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            const editBtn = taskItem.querySelector('.edit-btn');
            const taskText = taskItem.querySelector('.task-text');
            const editInput = taskItem.querySelector('.edit-input');
            const taskContent = taskItem.querySelector('.task-content');

            checkbox.addEventListener('change', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            editBtn.addEventListener('click', () => {
                taskText.style.display = 'none';
                editInput.style.display = 'block';
                editInput.focus();
                editInput.select();
            });

            editInput.addEventListener('blur', () => {
                const newText = editInput.value.trim();
                if (newText !== '') {
                    editTask(task.id, newText);
                }
                taskText.style.display = 'block';
                editInput.style.display = 'none';
            });

            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    editInput.blur();
                }
            });

            taskList.appendChild(taskItem);
        });

        updateTasksLeft();
    }

    // Toggle task completion
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }

    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });

    // Update tasks left counter
    function updateTasksLeft() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksLeft.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Edit task
    function editTask(id, newText) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }

    // Initial render
    renderTasks();
}); 