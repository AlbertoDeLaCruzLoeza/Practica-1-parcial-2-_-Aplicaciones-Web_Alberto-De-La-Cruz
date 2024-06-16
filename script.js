document.addEventListener('DOMContentLoaded', loadTasks);
document.querySelector('#task-form').addEventListener('submit', addTask);

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => displayTask(task));
}

function addTask(e) {
    e.preventDefault();

    const name = document.querySelector('#task-name').value;
    const startDate = document.querySelector('#task-start-date').value;
    const endDate = document.querySelector('#task-end-date').value;
    const responsible = document.querySelector('#task-responsible').value;

    if (new Date(endDate) < new Date(startDate)) {
        alert('La fecha de fin no puede ser menor a la fecha de inicio.');
        return;
    }

    const task = { id: Date.now(), name, startDate, endDate, responsible, completed: false };
    saveTaskToLocalStorage(task);
    displayTask(task);
    document.querySelector('#task-form').reset();
}

function displayTask(task) {
    const taskList = document.querySelector('#task-list');
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    taskItem.classList.add(checkTaskStatus(task));
    taskItem.setAttribute('data-id', task.id);

    taskItem.innerHTML = `
        <div>
            <strong>${task.name}</strong>
            <p class="mb-1">Inicio: ${task.startDate}, Fin: ${task.endDate}, Responsable: ${task.responsible}</p>
        </div>
        <div>
            <button class="btn btn-success btn-sm complete-task ${task.completed ? 'd-none' : ''}">Resolver</button>
            <button class="btn btn-secondary btn-sm uncomplete-task ${task.completed ? '' : 'd-none'}">Desmarcar</button>
            <button class="btn btn-danger btn-sm delete-task">Eliminar</button>
        </div>
    `;

    taskItem.querySelector('.complete-task').addEventListener('click', () => {
        if (new Date(task.endDate) < new Date()) {
            alert('La tarea ha vencido y no puede ser marcada como resuelta.');
            return;
        }
        task.completed = true;
        updateTaskInLocalStorage(task);
        taskItem.classList.remove('pending', 'expired');
        taskItem.classList.add('completed');
        taskItem.querySelector('.complete-task').classList.add('d-none');
        taskItem.querySelector('.uncomplete-task').classList.remove('d-none');
    });

    taskItem.querySelector('.uncomplete-task').addEventListener('click', () => {
        task.completed = false;
        updateTaskInLocalStorage(task);
        taskItem.classList.remove('completed');
        taskItem.classList.add(checkTaskStatus(task));
        taskItem.querySelector('.uncomplete-task').classList.add('d-none');
        taskItem.querySelector('.complete-task').classList.remove('d-none');
    });

    taskItem.querySelector('.delete-task').addEventListener('click', () => {
        removeTaskFromLocalStorage(task);
        taskItem.remove();
    });

    taskList.appendChild(taskItem);
}

function checkTaskStatus(task) {
    if (task.completed) {
        return 'completed';
    }
    return new Date(task.endDate) < new Date() ? 'expired' : 'pending';
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(t => (t.id === task.id ? task : t));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(t => t.id !== task.id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
