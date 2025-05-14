import { Task, Subtask } from './src/models.js';
const tasks = [];
const task1 = new Task('Задача 1');
task1.addSubtask('Подзадача 1.1');
const task2 = new Task('Задача 2');
['2.1', '2.2', '2.3'].forEach(s =>
    task2.addSubtask(new Subtask(`Подзадача ${s}`))
);
const task3 = new Task('Задача 3');
for (let i = 1; i <= 5; i++) {
    task3.addSubtask(`Подзадача 3.${i}`);
}
tasks.push(task1, task2, task3);
console.log(JSON.stringify(tasks.map(t => t.toJSON()), null, 2));
