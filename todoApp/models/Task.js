import { Subtask } from './Subtask.js';
export class Task {
    constructor(id, title, completed = false, subtasks = []) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.subtasks = subtasks.map(st =>
            st instanceof Subtask ? st : new Subtask(st.id, st.title, st.completed)
        );
    }
    toggle() {
        this.completed = !this.completed;
        if (this.completed) {
            this.subtasks.forEach(st => st.markCompleted());
        }
    }
}
