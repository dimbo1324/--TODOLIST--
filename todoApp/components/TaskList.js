import { renderSubtaskItem } from './SubtaskItem.js';

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
            checkbox.checked = t.completed;
            checkbox.addEventListener('change', () => store.selectTask(t.id));
            li.append(checkbox);

            li.append(t.title + (t.completed ? ' ✔' : ''));

            const addSubBtn = document.createElement('button');
            addSubBtn.textContent = 'Добавить подзадачу';
            addSubBtn.addEventListener('click', () => {
                const subTitle = prompt('Название подзадачи:');
                if (subTitle) store.addSubtask(t.id, subTitle);
            });
            li.append(addSubBtn);

            const subUl = document.createElement('ul');
            t.subtasks.forEach(st => {
                const subLi = renderSubtaskItem(st, store, t.id);
                if (st.deleted) subLi.classList.add('deleted');

                const subCheckbox = document.createElement('input');
                subCheckbox.type = 'checkbox';
                subCheckbox.checked = st.completed;
                subCheckbox.addEventListener('change', () => {
                    store.selectSubtask(t.id, st.id);
                });
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
