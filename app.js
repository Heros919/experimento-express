const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const errorMessage = document.querySelector('[data-cy="error-message"]');
const taskList = document.querySelector('[data-cy="task-list"]');
const taskCount = document.querySelector('[data-cy="task-count"]');
const taskFilter = document.querySelector('[data-cy="task-filter"]');
const emptyMessage = document.querySelector('[data-cy="empty-message"]');
const removeAllButton = document.querySelector('[data-cy="remove-all-button"]');

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const filter = taskFilter.value;
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  taskCount.textContent = String(tasks.length);
  taskList.replaceChildren();
  emptyMessage.hidden = visibleTasks.length > 0;
  removeAllButton.disabled = tasks.length === 0;

  visibleTasks.forEach((task) => {
    const item = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    const title = document.createElement('span');
    const removeButton = document.createElement('button');

    item.className = `task-item${task.completed ? ' completed' : ''}`;
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('data-cy', 'complete-checkbox');
    checkbox.setAttribute('aria-label', `Concluir ${task.title}`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    title.textContent = task.title;
    label.append(checkbox, title);

    removeButton.type = 'button';
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remover';
    removeButton.setAttribute('data-cy', 'remove-button');
    removeButton.setAttribute('aria-label', `Remover ${task.title}`);
    removeButton.addEventListener('click', () => {
      tasks = tasks.filter((itemTask) => itemTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(label, removeButton);
    taskList.append(item);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();

  if (!title) {
    errorMessage.textContent = 'Digite uma tarefa antes de adicionar.';
    taskInput.focus();
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    title,
    completed: false
  });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  errorMessage.textContent = '';
  taskInput.focus();
});

taskFilter.addEventListener('change', renderTasks);

removeAllButton.addEventListener('click', () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

renderTasks();
