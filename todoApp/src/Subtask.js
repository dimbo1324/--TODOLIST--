export class Subtask {
    #id;
    #title;
    #completed = false;
    constructor(title) {
        this.#id = nextId++;
        this.#title = title;
    }
    markCompleted() { this.#completed = true; }
    toggleCompleted() { this.#completed = !this.#completed; }
    toJSON() {
        return { id: this.#id, title: this.#title, completed: this.#completed };
    }
    get id() { return this.#id; }
    get title() { return this.#title; }
    get completed() { return this.#completed; }
}