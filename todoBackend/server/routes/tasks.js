const express = require('express');
const pool = require('../db');
const tasksRouter = express.Router();
tasksRouter.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM schema_main.tasks WHERE deleted = FALSE'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});
tasksRouter.post('/', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
        const result = await pool.query(
            'INSERT INTO schema_main.tasks (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});
tasksRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const result = await pool.query(
            'UPDATE schema_main.tasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Task not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});
tasksRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(
                'UPDATE schema_main.subtasks SET deleted = TRUE WHERE task_id = $1',
                [id]
            );
            const taskRes = await client.query(
                'UPDATE schema_main.tasks SET deleted = TRUE WHERE id = $1 RETURNING *',
                [id]
            );
            await client.query('COMMIT');
            if (!taskRes.rows.length) return res.status(404).json({ error: 'Task not found' });
            res.json(taskRes.rows[0]);
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
module.exports = tasksRouter;