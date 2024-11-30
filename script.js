const GITHUB_API_URL = "https://api.github.com";
const REPO_OWNER = "Edgarabazyan1989"; // Ваш GitHub username
const REPO_NAME = "obsidian-notes"; // Имя репозитория
const FILE_PATH = "tasks.json"; // Путь к файлу
const GITHUB_TOKEN = "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"; // Ваш Personal Access Token

// Функция для получения содержимого файла
async function fetchTasks() {
    const response = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`
        }
    });
    const data = await response.json();
    const content = atob(data.content); // Раскодируем Base64
    return {
        tasks: JSON.parse(content),
        sha: data.sha // SHA файла, нужен для обновления
    };
}

// Функция для сохранения задач
async function saveTasks(tasks, sha) {
    const content = btoa(JSON.stringify(tasks, null, 2)); // Закодируем Base64
    const response = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Обновление задач",
            content: content,
            sha: sha
        })
    });
    return response.ok;
}

// Пример использования
document.getElementById('task-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const responsible = document.getElementById('task-responsible').value;
    const deadline = document.getElementById('task-deadline').value;

    // Загружаем текущие задачи
    const { tasks, sha } = await fetchTasks();

    // Добавляем новую задачу
    tasks.push({
        title,
        desc,
        responsible,
        deadline,
        status: "Новая"
    });

    // Сохраняем задачи в GitHub
    const success = await saveTasks(tasks, sha);
    if (success) {
        alert("Задача добавлена!");
        location.reload();
    } else {
        alert("Ошибка при сохранении задачи.");
    }
});

// Загрузка задач на страницу
async function loadTasks() {
    const { tasks } = await fetchTasks();
    const table = document.getElementById('tasks-table').querySelector('tbody');

    tasks.forEach((task, index) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${task.title}</td>
            <td>${task.desc}</td>
            <td>${task.responsible}</td>
            <td>${task.deadline}</td>
            <td>${task.status}</td>
            <td class="actions">
                <button onclick="editTask(this)">Редактировать</button>
                <button onclick="deleteTask(this, ${index})">Удалить</button>
            </td>
        `;
    });
}

// Удаление задачи
async function deleteTask(button, index) {
    const { tasks, sha } = await fetchTasks();
    tasks.splice(index, 1); // Удаляем задачу по индексу

    const success = await saveTasks(tasks, sha);
    if (success) {
        alert("Задача удалена!");
        location.reload();
    } else {
        alert("Ошибка при удалении задачи.");
    }
}

// Загрузка задач при старте
document.addEventListener('DOMContentLoaded', loadTasks);
