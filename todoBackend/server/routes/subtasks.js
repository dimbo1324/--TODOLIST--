const express = require('express');
const pool = require('../db');
const subtasksRouter = express.Router({ mergeParams: true });
subtasksRouter.get('/', async (req, res) => {
    const { taskId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM schema_main.subtasks WHERE task_id = $1 AND deleted = FALSE',
            [taskId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});
subtasksRouter.post('/', async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
        const result = await pool.query(
            'INSERT INTO schema_main.subtasks (task_id, title) VALUES ($1, $2) RETURNING *',
            [taskId, title]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});
subtasksRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const result = await pool.query(
            'UPDATE schema_main.subtasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Subtask not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});
subtasksRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE schema_main.subtasks SET deleted = TRUE WHERE id = $1 RETURNING *',
            [id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Subtask not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    }
});
module.exports = subtasksRouter;