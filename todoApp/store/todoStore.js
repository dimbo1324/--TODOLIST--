export function initStore() {
    let tasks = [];
    const emitter = {
        events: {},
        emit(event, data) {
            if (this.events[event]) this.events[event].forEach(cb => cb(data));
        },
        subscribe(event, cb) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(cb);
        }
    };
    let idCounter = 0;
    const tasksProxy = new Proxy(tasks, {
        set(target, prop, value) {
            target[prop] = value;
            emitter.emit('update', tasks);
            return true;
        }
    });
    return {
        addTask: (title) => {
            tasksProxy.push({
                id: idCounter++,
                title,
                completed: false,
                selected: false,
                deleted: false,
                subtasks: []
            });
        },
        addSubtask: (taskId, title) => {
            const task = tasksProxy.find(t => t.id === taskId);
            if (task) {
                task.subtasks.push({
                    id: idCounter++,
                    title,
                    completed: false,
                    selected: false,
                    deleted: false
                });
                emitter.emit('update', tasksProxy);
            }
        },
        selectTask: (taskId) => {
            const task = tasksProxy.find(t => t.id === taskId);
            if (task) task.selected = !task.selected;
            emitter.emit('update', tasksProxy);
        },
        selectSubtask: (taskId, subtaskId) => {
            const task = tasksProxy.find(t => t.id === taskId);
            if (task) {
                const subtask = task.subtasks.find(st => st.id === subtaskId);
                if (subtask) subtask.selected = !subtask.selected;
                emitter.emit('update', tasksProxy);
            }
        },
        removeSelected: () => {
            tasksProxy.forEach(t => {
                if (t.selected) t.deleted = true;
                t.subtasks.forEach(st => {
                    if (st.selected) st.deleted = true;
                });
            });
            tasksProxy.forEach(t => {
                t.subtasks = t.subtasks.filter(st => !st.deleted);
            });
            tasksProxy.splice(0, tasksProxy.length, ...tasksProxy.filter(t => !t.deleted));
            emitter.emit('update', tasksProxy);
        },
        getAll: () => tasksProxy,
        subscribe: (event, cb) => emitter.subscribe(event, cb)
    };
}