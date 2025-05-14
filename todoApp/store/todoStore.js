import { Task } from '../models/Task.js';
import { Subtask } from '../models/Subtask.js';
import { EventEmitter } from '../utils/events.js';
let nextId = 1;
export function initStore() {
    const emitter = new EventEmitter();
    const tasks = [
        new Task(nextId++, 'Задача 1'),
        new Task(nextId++, 'Задача 2', false, [
            new Subtask(nextId++, '2.1'),
            new Subtask(nextId++, '2.2'),
        ]),
        new Task(nextId++, 'Задача 3', false, [
            new Subtask(nextId++, '3.1'),
        ]),
    ];
    return {
        subscribe: emitter.subscribe.bind(emitter),
        emit: emitter.emit.bind(emitter),
        getAll: () => tasks,
        addTask: title => {
            tasks.push(new Task(nextId++, title));
            emitter.emit('update', tasks);
        },
        removeTask: id => {
            const idx = tasks.findIndex(t => t.id === id);
            if (idx >= 0) tasks.splice(idx, 1);
            emitter.emit('update', tasks);
        },
        toggleTask: id => {
            const t = tasks.find(t => t.id === id);
            if (t) {
                t.toggle();
                emitter.emit('update', tasks);
            }
        }
    };
}
