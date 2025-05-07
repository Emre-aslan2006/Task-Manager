const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const priorityInput = document.getElementById('priority');
const dueDateInput = document.getElementById('due-date');
const searchInput = document.getElementById('search');
const list = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filters button');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let theme = localStorage.getItem('theme') || 'light';

if (theme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;

  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false,
    priority,
    dueDate,
  };

  tasks.push(task);
  input.value = '';
  dueDateInput.value = '';
  saveAndRender();
});

function renderTasks(filter = 'all') {
  const searchQuery = searchInput.value.toLowerCase();
  list.innerHTML = '';

  const filtered = tasks.filter(task =>
    (filter === 'all' ? true :
     filter === 'completed' ? task.completed :
     !task.completed) &&
    task.text.toLowerCase().includes(searchQuery)
  );

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div>
        <span ondblclick="editTask(${task.id})">${task.text}</span>
        <div class="task-meta">
          <span class="priority-${task.priority}">${task.priority.toUpperCase()}</span>
          ${task.dueDate ? ` | Due: ${task.dueDate}` : ''}
        </div>
      </div>
      <div>
        <button onclick="toggleTask(${task.id})">✅</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateProgress();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt('Edit your task:', task.text);
  if (newText && newText.trim()) {
    task.text = newText.trim();
    saveAndRender();
  }
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const percent = total ? (done / total) * 100 : 0;
  document.getElementById('progress-bar').style.width = `${percent}%`;
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(document.querySelector('.filters button.active')?.dataset.filter || 'all');
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filters button.active')?.classList.remove('active');
    btn.classList.add('active');
    renderTasks(btn.dataset.filter);
  });
});

searchInput.addEventListener('input', saveAndRender);

saveAndRender();
