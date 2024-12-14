const API_URL = 'http://localhost:3000/api';
let currentTaskId = null;

async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Create a new task
async function createTask() {
    const titleInput = document.getElementById('titleInput');
    const descriptionInput = document.getElementById('descriptionInput');

    const task = {
        title: titleInput.value,
        description: descriptionInput.value
    };

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            titleInput.value = '';
            descriptionInput.value = '';
            fetchTasks();
        } else {
            console.error('Failed to create task:', await response.json());
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Open edit modal
function openEditModal(id, title, description) {
    currentTaskId = id;
    document.getElementById('editTitleInput').value = title;
    document.getElementById('editDescriptionInput').value = description;
    document.getElementById('editModal').style.display = 'block';
}

// Close edit modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Update task
async function updateTask() {
    const titleInput = document.getElementById('editTitleInput');
    const descriptionInput = document.getElementById('editDescriptionInput');

    const task = {
        title: titleInput.value,
        description: descriptionInput.value
    };

    try {
        const response = await fetch(`${API_URL}/tasks/${currentTaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            closeModal();
            fetchTasks();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Toggle task completion status
async function toggleTask(id, completed) {
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !completed })
        });
        fetchTasks();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Delete task
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        fetchTasks();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display tasks in the DOM
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div onclick="toggleTask('${task._id}', ${task.completed})">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
            </div>
            <div>
                <button class="edit-btn" onclick="openEditModal('${task._id}', '${task.title}', '${task.description}')">Edit</button>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initial load
fetchTasks();
