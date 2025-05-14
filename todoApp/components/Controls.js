export class RenderControls {
    #store;
    #container;
    #btnAdd;
    #btnToggleList;
    #btnRemoveSelected;
    #listVisible = true;
    constructor(store) {
        this.#store = store;
        this.#container = document.createElement('div');
        this.#btnAdd = document.createElement('button');
        this.#btnToggleList = document.createElement('button');
        this.#btnRemoveSelected = document.createElement('button');
        this.#btnAdd.textContent = 'Добавить задачу';
        this.#btnToggleList.textContent = 'Свернуть список';
        this.#btnRemoveSelected.textContent = 'Удалить выбранные';
        this.#btnRemoveSelected.disabled = true;
        this.#bindStore();
        this.#bindEvents();
        this.#container.append(
            this.#btnAdd,
            this.#btnToggleList,
            this.#btnRemoveSelected
        );
    }
    static main(store) {
        return new RenderControls(store).#container;
    }
    #bindStore() {
        this.#store.subscribe('update', tasks => {
            const hasSelected = tasks.some(
                t => t.completed || t.subtasks.some(st => st.completed)
            );
            this.#btnRemoveSelected.disabled = !hasSelected;
        });
    }
    #bindEvents() {
        this.#btnAdd.addEventListener('click', () => {
            const title = prompt('Название новой задачи:');
            if (title) this.#store.addTask(title);
        });
        this.#btnToggleList.addEventListener('click', () => {
            this.#listVisible = !this.#listVisible;
            this.#btnToggleList.textContent = this.#listVisible
                ? 'Свернуть список'
                : 'Развернуть список';
            document.getElementById('taskList').style.display = this.#listVisible
                ? 'block'
                : 'none';
        });
        this.#btnRemoveSelected.addEventListener('click', () => {
            this.#store.removeSelected();
        });
    }
}
