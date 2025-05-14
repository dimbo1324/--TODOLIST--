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
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
        const newTask = await pool.query(
            'INSERT INTO schema_main.tasks (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.json(newTask.rows[0]);
    } catch (err) {
        console.error(err.stack);
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
        if (updatedTask.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE schema_main.tasks SET deleted = TRUE WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});