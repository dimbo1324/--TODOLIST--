
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await pool.query(
            'SELECT * FROM schema_main.tasks WHERE deleted = FALSE'
        );
        res.json(tasks.rows);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
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
        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(
                'UPDATE schema_main.subtasks SET deleted = TRUE WHERE task_id = $1',
                [id]
            );
            const taskResult = await client.query(
                'UPDATE schema_main.tasks SET deleted = TRUE WHERE id = $1 RETURNING *',
                [id]
            );
            await client.query('COMMIT');

            if (taskResult.rows.length === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(taskResult.rows[0]);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err.stack);
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
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks/:taskId/subtasks', async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const newSubtask = await pool.query(
            'INSERT INTO schema_main.subtasks (task_id, title) VALUES ($1, $2) RETURNING *',
            [taskId, title]
        );
        res.json(newSubtask.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

app.put('/subtasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const updated = await pool.query(
            'UPDATE schema_main.subtasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );
        if (updated.rows.length === 0) {
            return res.status(404).json({ error: 'Subtask not found' });
        }
        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/subtasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await pool.query(
            'UPDATE schema_main.subtasks SET deleted = TRUE WHERE id = $1 RETURNING *',
            [id]
        );
        if (deleted.rows.length === 0) {
            return res.status(404).json({ error: 'Subtask not found' });
        }
        res.json(deleted.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
