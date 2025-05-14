export function renderTaskList(store) {
    const ul = document.createElement('ul');
    function redraw(tasks) {
        ul.innerHTML = '';
        tasks.forEach(t => {
            const li = document.createElement('li');
            li.textContent = t.title + (t.completed ? ' ✔' : '');
            li.addEventListener('click', () => store.toggleTask(t.id));
            ul.append(li);
        });
    }
    redraw(store.getAll());
    store.subscribe('update', redraw);
    return ul;
}
