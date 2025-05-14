import { Task } from './src/Task.js';
let nextId = 1;
const tasks = [];
const task1 = new Task(nextId, 'Задача 1');
task1.addSubtask(new Subtask('Подзадача 1.1'));
const task2 = new Task('Задача 2');
task2.addSubtask(new Subtask('Подзадача 2.1'));
task2.addSubtask(new Subtask('Подзадача 2.2'));
task2.addSubtask(new Subtask('Подзадача 2.3'));
const task3 = new Task('Задача 3');
for (let i = 1; i <= 5; i++) {
    task3.addSubtask(new Subtask(`Подзадача 3.${i}`));
}
tasks.push(task1, task2, task3);
console.log(JSON.stringify(tasks.map(t => t.toJSON()), null, 2));
