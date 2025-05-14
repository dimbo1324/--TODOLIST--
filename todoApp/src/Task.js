import { Subtask } from './Subtask.js';
export class Task {
    #id;
    #title;
    #completed = false;
    #subtasks = [];
    constructor(nextId, title) {
        this.#id = nextId++;
        this.#title = title;
    }
    addSubtask(subtask) {
        if (!(subtask instanceof Subtask)) {
            throw new Error('Invalid subtask');
        }
        this.#subtasks.push(subtask);
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
    // ! ЗОНА работы с приватными полями
    get id() { return this.#id; }
    get title() { return this.#title; }
    get completed() { return this.#completed; }
    get subtasks() { return [...this.#subtasks]; }
}