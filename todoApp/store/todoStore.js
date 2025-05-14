import { Task } from '../models/Task.js';
import { Subtask } from '../models/Subtask.js';
import { EventEmitter } from '../utils/events.js';
let nextId = 1;
export function initStore() {
    const emitter = new EventEmitter();
    let tasks = [
        new Task(nextId++, 'Задача 1'),
        new Task(nextId++, 'Задача 2', false, [
            new Subtask(nextId++, '2.1'),
            new Subtask(nextId++, '2.2'),
        ]),
        new Task(nextId++, 'Задача 3', false, [
            new Subtask(nextId++, '3.1'),
        ]),
    ];
    const tasksProxy = new Proxy(tasks, {
        set(target, property, value) {
            console.log(`Store updated: ${property} = ${JSON.stringify(value)}`);
            target[property] = value;
            emitter.emit('update', target);
            return true;
        }
    });
    return {
        subscribe: emitter.subscribe.bind(emitter),
        emit: emitter.emit.bind(emitter),
        getAll: () => tasksProxy,
        addTask: title => {
            const newTask = new Task(nextId++, title);
            tasksProxy.push(newTask);
            console.log(`Added task: ${title}`);
            if (Notification.permission === 'granted') {
                new Notification('Task added', { body: `Added task: ${title}` });
            }
        },
        removeTask: id => {
            const t = tasksProxy.find(t => t.id === id);
            if (t) {
                t.deleted = true;
                t.subtasks.forEach(st => st.deleted = true);
                console.log(`Deleted task: ${t.title}`);
                emitter.emit('update', tasksProxy);
            }
        },
        toggleTask: id => {
            const t = tasksProxy.find(t => t.id === id);
            if (t) {
                t.toggle();
                emitter.emit('update', tasksProxy);
            }
        },
        addSubtask: (taskId, title) => {
            const t = tasksProxy.find(t => t.id === taskId);
            if (t) {
                t.subtasks.push(new Subtask(nextId++, title));
                console.log(`Added subtask: ${title} to task ${t.title}`);
                emitter.emit('update', tasksProxy);
            }
        },
        toggleSubtask: (taskId, subtaskId) => {
            const t = tasksProxy.find(t => t.id === taskId);
            if (t) {
                const st = t.subtasks.find(st => st.id === subtaskId);
                if (st) {
                    st.toggle();
                    emitter.emit('update', tasksProxy);
                }
            }
        },
        removeSubtask: (taskId, subtaskId) => {
            const t = tasksProxy.find(t => t.id === taskId);
            if (t) {
                const st = t.subtasks.find(st => st.id === subtaskId);
                if (st) {
                    st.deleted = true;
                    console.log(`Deleted subtask: ${st.title}`);
                    emitter.emit('update', tasksProxy);
                }
            }
        },
        selectTask: id => {
            const t = tasksProxy.find(t => t.id === id);
            if (t) {
                t.selected = !t.selected;
                emitter.emit('update', tasksProxy);
            }
        },
        selectSubtask: (taskId, subtaskId) => {
            const t = tasksProxy.find(t => t.id === taskId);
            if (t) {
                const st = t.subtasks.find(st => st.id === subtaskId);
                if (st) {
                    st.selected = !st.selected;
                    emitter.emit('update', tasksProxy);
                }
            }
        },
        removeSelected: () => {
            tasksProxy.forEach(t => {
                if (t.selected) {
                    t.deleted = true;
                    console.log(`Deleted selected task: ${t.title}`);
                }
                t.subtasks.forEach(st => {
                    if (st.selected) {
                        st.deleted = true;
                        console.log(`Deleted selected subtask: ${st.title}`);
                    }
                });
            });
            emitter.emit('update', tasksProxy);
        }
    };
}