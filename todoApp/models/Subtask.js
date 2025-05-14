export class Subtask {
    constructor(id, title, completed = false, selected = false, deleted = false) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.selected = selected;
        this.deleted = deleted;
    }

    toggle() {
        this.completed = !this.completed;
    }

    markCompleted() {
        this.completed = true;
    }
}
