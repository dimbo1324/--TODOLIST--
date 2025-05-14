import { fetchTasks, addTask, updateTask, deleteTask, fetchSubtasks, addSubtask } from '../utils/apiClient.js';

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

    async function loadTasks() {
        tasks = await fetchTasks();
        for (let task of tasks) {
            task.subtasks = await fetchSubtasks(task.id);
        }
        emitter.emit('update', tasks);
    }
    loadTasks();

    return {
        addTask: async (title) => {
            const newTask = await addTask(title);
            newTask.subtasks = [];
            tasks.push(newTask);
            emitter.emit('update', tasks);
        },
        addSubtask: async (taskId, title) => {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                const newSubtask = await addSubtask(taskId, title);
                task.subtasks.push(newSubtask);
                emitter.emit('update', tasks);
            }
        },
        selectTask: async (taskId) => {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                await updateTask(taskId, task.completed);
                emitter.emit('update', tasks);
            }
        },
        selectSubtask: (taskId, subtaskId) => {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                const subtask = task.subtasks.find(st => st.id === subtaskId);
                if (subtask) subtask.completed = !subtask.completed;
                emitter.emit('update', tasks);
            }
        },
        removeSelected: async () => {
            for (let task of tasks) {
                if (task.completed) await deleteTask(task.id);
            }
            tasks = tasks.filter(t => !t.completed);
            emitter.emit('update', tasks);
        },
        getAll: () => tasks,
        subscribe: (event, cb) => emitter.subscribe(event, cb)
    };
}