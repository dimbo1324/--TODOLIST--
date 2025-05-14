let nextId = 1;
export class Subtask {
    #id;
    #title;
    #completed = false;
    constructor(title, nextId = 1) {
        this.#id = nextId++;
        this.#title = title;
    }
    get id() { return this.#id; }
    get title() { return this.#title; }
    get completed() { return this.#completed; }
    markCompleted() { this.#completed = true; }
    toggleCompleted() { this.#completed = !this.#completed; }
    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            completed: this.#completed
        };
    }
}
export class Task {
    #id;
    #title;
    #completed = false;
    #subtasks = [];
    constructor(title) {
        this.#id = nextId++;
        this.#title = title;
    }
    get id() { return this.#id; }
    get title() { return this.#title; }
    get completed() { return this.#completed; }
    get subtasks() { return [...this.#subtasks]; }
    addSubtask(subtaskOrTitle) {
        const subtask = subtaskOrTitle instanceof Subtask
            ? subtaskOrTitle
            : new Subtask(subtaskOrTitle);
        this.#subtasks.push(subtask);
    }
    removeSubtask(id) {
        this.#subtasks = this.#subtasks.filter(st => st.id !== id);
    }
    toggleCompleted() {
        this.#completed = !this.#completed;
        if (this.#completed) {
            this.#subtasks.forEach(st => st.markCompleted());
        }
    }
    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            completed: this.#completed,
            subtasks: this.#subtasks.map(st => st.toJSON())
        };
    }
}
