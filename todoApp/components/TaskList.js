export function renderTaskList(store) {
    const ul = document.createElement('ul');
    ul.id = 'taskList';
    function redraw(tasks) {
        ul.innerHTML = '';
        tasks.forEach(t => {
            const li = document.createElement('li');
            if (t.deleted) li.classList.add('deleted');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = t.selected;
            checkbox.addEventListener('change', () => store.selectTask(t.id));
            li.append(checkbox);
            li.append(t.title + (t.completed ? ' ✔' : ''));
            li.addEventListener('click', (e) => {
                if (e.target !== checkbox && !li.querySelector('textarea')) {
                    const textarea = document.createElement('textarea');
                    const btnAccept = document.createElement('button');
                    const btnCancel = document.createElement('button');
                    btnAccept.textContent = 'Принять';
                    btnCancel.textContent = 'Отменить';
                    btnAccept.addEventListener('click', () => {
                        const title = textarea.value;
                        if (title) store.addSubtask(t.id, title);
                        li.removeChild(textarea);
                        li.removeChild(btnAccept);
                        li.removeChild(btnCancel);
                    });
                    btnCancel.addEventListener('click', () => {
                        li.removeChild(textarea);
                        li.removeChild(btnAccept);
                        li.removeChild(btnCancel);
                    });
                    li.append(textarea, btnAccept, btnCancel);
                    textarea.focus();
                    e.stopPropagation();
                }
            });
            const subUl = document.createElement('ul');
            t.subtasks.forEach(st => {
                const subLi = renderSubtaskItem(st, store, t.id);
                if (st.deleted) subLi.classList.add('deleted');
                const subCheckbox = document.createElement('input');
                subCheckbox.type = 'checkbox';
                subCheckbox.checked = st.selected;
                subCheckbox.addEventListener('change', () => store.selectSubtask(t.id, st.id));
                subLi.prepend(subCheckbox);
                subUl.append(subLi);
            });
            li.append(subUl);
            ul.append(li);
        });
    }
    redraw(store.getAll());
    store.subscribe('update', redraw);
    return ul;
}
function renderSubtaskItem(subtask, store, taskId) {
    const li = document.createElement('li');
    li.textContent = subtask.title + (subtask.completed ? ' ✔' : '');
    return li;
}