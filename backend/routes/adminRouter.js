import express from 'express';
import pool from '../database.js';
import { authToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();



router.get('/all', authToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role FROM users ORDER BY id ASC');
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching all tasks.' });
  }
});

router.delete('/:id', authToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    if(parseInt(id, 10) === req.userId) {
      return res.status(400).json({ error: 'You cannot delete your own admin account'});
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server error deleting the user' });
  };
});

export default router;