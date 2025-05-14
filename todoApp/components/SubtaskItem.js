export function renderSubtaskItem(subtask, store, taskId) {
    const li = document.createElement('li');
    li.textContent = subtask.title + (subtask.completed ? ' ✔' : '');
    li.addEventListener('click', (e) => {
        if (e.target.type !== 'checkbox') {
            store.toggleSubtask(taskId, subtask.id);
        }
    });
    return li;
}
