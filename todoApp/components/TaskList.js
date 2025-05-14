import { renderSubtaskItem } from './SubtaskItem.js';
export class RenderTaskList {
    #store;
    #ul;
    #redraw;
    constructor(store) {
        this.#store = store;
        this.#ul = document.createElement('ul');
        this.#ul.id = 'taskList';
        this.#redraw = (tasks) => {
            this.#ul.innerHTML = '';
            tasks.forEach(t => {
                const li = document.createElement('li');
                if (t.deleted) li.classList.add('deleted');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = t.completed;
                checkbox.addEventListener('change', () => this.#store.selectTask(t.id));
                li.append(checkbox);
                li.append(t.title + (t.completed ? ' ✔' : ''));
                const addSubBtn = document.createElement('button');
                addSubBtn.textContent = 'Добавить подзадачу';
                addSubBtn.addEventListener('click', () => {
                    const subTitle = prompt('Название подзадачи:');
                    if (subTitle) this.#store.addSubtask(t.id, subTitle);
                });
                li.append(addSubBtn);
                const subUl = document.createElement('ul');
                t.subtasks.forEach(st => {
                    const subLi = renderSubtaskItem(st, this.#store, t.id);
                    if (st.deleted) subLi.classList.add('deleted');
                    const subCheckbox = document.createElement('input');
                    subCheckbox.type = 'checkbox';
                    subCheckbox.checked = st.completed;
                    subCheckbox.addEventListener('change', () => {
                        this.#store.selectSubtask(t.id, st.id);
                    });
                    subLi.prepend(subCheckbox);
                    subUl.append(subLi);
                });
                li.append(subUl);
                this.#ul.append(li);
            });
        };
        this.#redraw(this.#store.getAll());
        this.#store.subscribe('update', this.#redraw);
    }
    static main(store) {
        return new RenderTaskList(store).#ul;
    }
}
