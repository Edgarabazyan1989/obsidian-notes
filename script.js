document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const responsible = document.getElementById('task-responsible').value;
    const deadline = document.getElementById('task-deadline').value;

    const table = document.getElementById('tasks-table').querySelector('tbody');
    const row = table.insertRow();

    row.innerHTML = `
        <td>${table.rows.length}</td>
        <td>${title}</td>
        <td>${desc}</td>
        <td>${responsible}</td>
        <td>${deadline}</td>
        <td>Новая</td>
        <td class="actions">
            <button onclick="editTask(this)">Редактировать</button>
            <button onclick="deleteTask(this)">Удалить</button>
        </td>
    `;

    this.reset();
});

function deleteTask(button) {
    const row = button.closest('tr');
    row.remove();
}

function editTask(button) {
    alert('Функция редактирования в разработке!');
}
