export function renderControls(store) {
    const container = document.createElement('div');
    const btnAdd = document.createElement('button');
    const btnRemove = document.createElement('button');
    const btnRemoveSelected = document.createElement('button');
    btnAdd.textContent = 'Добавить задачу';
    btnRemove.textContent = 'Удалить задачу';
    btnRemoveSelected.textContent = 'Удалить выбранные';
    btnRemove.disabled = true;
    store.subscribe('update', tasks => {
        btnRemove.disabled = tasks.length === 0;
    });
    btnAdd.addEventListener('click', () => {
        const title = prompt('Название новой задачи:');
        if (title) store.addTask(title);
    });
    btnRemove.addEventListener('click', () => {
        const all = store.getAll();
        if (!all.length) return;
        store.removeTask(all[all.length - 1].id);
    });
    btnRemoveSelected.addEventListener('click', () => {
        store.removeSelected();
    });
    container.append(btnAdd, btnRemove, btnRemoveSelected);
    return container;
}