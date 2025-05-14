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
            task.selected = false;
            task.deleted = false;
            task.subtasks.forEach(st => {
                st.selected = false;
                st.deleted = false;
            });
        }
        emitter.emit('update', tasksProxy);
    }
    loadTasks();

    const tasksProxy = new Proxy(tasks, {
        set(target, prop, value) {
            target[prop] = value;
            emitter.emit('update', tasks);
            console.log(`Изменение в задачах: ${JSON.stringify(tasks)}`);
            if (Notification.permission === 'granted') {
                new Notification('Изменение в задачах', {
                    body: `Список задач обновлён: ${JSON.stringify(tasks)}`,
                });
            }
            return true;
        }
    });

    return {
        addTask: async (title) => {
            const newTask = await addTask(title);
            newTask.subtasks = [];
            newTask.selected = false;
            newTask.deleted = false;
            tasksProxy.push(newTask);
        },
        addSubtask: async (taskId, title) => {
            const task = tasksProxy.find(t => t.id === taskId);
            if (task) {
                const newSubtask = await addSubtask(taskId, title);
                newSubtask.selected = false;
                newSubtask.deleted = false;
                task.subtasks.push(newSubtask);
                emitter.emit('update', tasksProxy);
            }
        },
        selectTask: (taskId) => {
            const task = tasksProxy.find(t => t.id === taskId);
            if (task) {
                task.selected = !task.selected;
                emitter.emit('update', tasksProxy);
            }
        },
        selectSubtask: (taskId, subtaskId) => {
            const task = tasksProxy.find(t => t.id === taskId);
            if (task) {
                const subtask = task.subtasks.find(st => st.id === subtaskId);
                if (subtask) {
                    subtask.selected = !subtask.selected;
                    emitter.emit('update', tasksProxy);
                }
            }
        },
        removeSelected: async () => {
            for (let task of tasksProxy) {
                if (task.selected && !task.deleted) {
                    task.deleted = true;
                    await deleteTask(task.id);
                    task.subtasks.forEach(st => {
                        st.deleted = true;
                    });
                }
                task.subtasks.forEach(st => {
                    if (st.selected && !st.deleted) {
                        st.deleted = true;
                    }
                });
            }
            emitter.emit('update', tasksProxy);
        },
        getAll: () => tasksProxy,
        subscribe: (event, cb) => emitter.subscribe(event, cb)
    };
}