import express from 'express';
import pool from '../database.js';
import { authToken } from '../middleware/authMiddleware.js'

const router = express.Router();


router.get('/', authToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, done FROM todos WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]
    );

    res.json(result.rows)
  } catch(error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Server error fetching tasks.' });
  }
});

router.post('/', authToken, async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING id, title, done, created_at',
      [req.userId, title.trim()]
    );

    res.status(201).json({
      message: 'Todo created successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Server error creating task.' });
  }
});

router.patch('/:id', authToken, async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  if (typeof done !== 'boolean') {
    return res.status(400).json({ error: 'done must be true or false.' });
  }

  try {
    const result = await pool.query(
      'UPDATE todos SET done = $1 WHERE id = $2 AND user_id = $3 RETURNING id, title, done, created_at',
      [done, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    res.json({ todo: result.rows[0] });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Server error updating task.' });
  }
});

router.delete("/:id", authToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2', [id, req.userId]);
    res.json({ message: 'Task was deleted'})
  } catch (error) {
    res.status(500).json({ error: 'Server Error While Deleting Todo' });
  }
});

export default router;