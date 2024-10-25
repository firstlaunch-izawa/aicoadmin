const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { logger } = require('../lib/logger');

// クライアント一覧の取得
router.get('/', (req, res) => {
  try {
    const clients = db.prepare(`
      SELECT * FROM clients 
      ORDER BY last_ping DESC
    `).all();
    
    res.json(clients);
  } catch (error) {
    logger.error('Failed to get clients:', error);
    res.status(500).json({ error: 'Failed to get clients' });
  }
});

// クライアントの追加
router.post('/', (req, res) => {
  const { id, name, greetingMessage } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO clients (id, name, status, last_ping, greeting_message)
      VALUES (?, ?, 'offline', datetime('now'), ?)
    `).run(id, name, greetingMessage);

    res.status(201).json({ id, name, greetingMessage });
  } catch (error) {
    logger.error('Failed to create client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// クライアントの更新
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, greetingMessage } = req.body;

  try {
    const result = db.prepare(`
      UPDATE clients 
      SET name = ?, greeting_message = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(name, greetingMessage, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ id, name, greetingMessage });
  } catch (error) {
    logger.error('Failed to update client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// クライアントの削除
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const result = db.prepare('DELETE FROM clients WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;