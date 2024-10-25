const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { logger } = require('../lib/serverLogger');

// ユーザー一覧の取得
router.get('/', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT * FROM users 
      ORDER BY last_name, first_name
    `).all();
    
    res.json(users);
  } catch (error) {
    logger.error('Failed to get users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// ユーザーの追加
router.post('/', (req, res) => {
  const { firstName, lastName, email, chatworkId, lineId } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO users (first_name, last_name, email, chatwork_id, line_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(firstName, lastName, email, chatworkId || null, lineId || null);

    res.status(201).json({
      id: result.lastInsertRowid,
      firstName,
      lastName,
      email,
      chatworkId,
      lineId,
    });
  } catch (error) {
    logger.error('Failed to create user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ユーザーの更新
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, chatworkId, lineId } = req.body;

  try {
    const result = db.prepare(`
      UPDATE users 
      SET first_name = ?, last_name = ?, email = ?, chatwork_id = ?, line_id = ?, 
          updated_at = datetime('now')
      WHERE id = ?
    `).run(firstName, lastName, email, chatworkId || null, lineId || null, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id,
      firstName,
      lastName,
      email,
      chatworkId,
      lineId,
    });
  } catch (error) {
    logger.error('Failed to update user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ユーザーの削除
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;