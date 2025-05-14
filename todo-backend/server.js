const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await pool.query('SELECT * FROM schema_main.tasks WHERE deleted = FALSE');
        res.json(tasks.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    const { title } = req.body;
    try {
        const newTask = await pool.query(
            'INSERT INTO schema_main.tasks (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.json(newTask.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const updatedTask = await pool.query(
            'UPDATE schema_main.tasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );
        res.json(updatedTask.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE schema_main.tasks SET deleted = TRUE WHERE id = $1', [id]);
        res.json({ message: 'Задача удалена' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/tasks/:taskId/subtasks', async (req, res) => {
    const { taskId } = req.params;
    try {
        const subtasks = await pool.query(
            'SELECT * FROM schema_main.subtasks WHERE task_id = $1 AND deleted = FALSE',
            [taskId]
        );
        res.json(subtasks.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks/:taskId/subtasks', async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;
    try {
        const newSubtask = await pool.query(
            'INSERT INTO schema_main.subtasks (task_id, title) VALUES ($1, $2) RETURNING *',
            [taskId, title]
        );
        res.json(newSubtask.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});