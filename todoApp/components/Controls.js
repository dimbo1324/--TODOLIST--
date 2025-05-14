
export function renderControls(store) {
    const container = document.createElement('div');
    const btnAdd = document.createElement('button');
    const btnToggleList = document.createElement('button');
    const btnRemoveSelected = document.createElement('button');

    btnAdd.textContent = 'Добавить задачу';
    btnToggleList.textContent = 'Свернуть список';
    btnRemoveSelected.textContent = 'Удалить выбранные';
    btnRemoveSelected.disabled = true;

    let listVisible = true;

    store.subscribe('update', tasks => {
        const hasSelected = tasks.some(
            t => t.completed || t.subtasks.some(st => st.completed)
        );
        btnRemoveSelected.disabled = !hasSelected;
    });

    btnAdd.addEventListener('click', () => {
        const title = prompt('Название новой задачи:');
        if (title) store.addTask(title);
    });

    btnToggleList.addEventListener('click', () => {
        listVisible = !listVisible;
        btnToggleList.textContent = listVisible
            ? 'Свернуть список'
            : 'Развернуть список';
        document.getElementById('taskList').style.display = listVisible
            ? 'block'
            : 'none';
    });

    btnRemoveSelected.addEventListener('click', () => {
        store.removeSelected();
    });

    container.append(btnAdd, btnToggleList, btnRemoveSelected);
    return container;
}
