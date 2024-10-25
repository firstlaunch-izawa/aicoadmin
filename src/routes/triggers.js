const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { logger } = require('../lib/serverLogger');

// トリガー一覧の取得
router.get('/', (req, res) => {
  try {
    const triggers = db.prepare(`
      SELECT * FROM keyword_triggers 
      ORDER BY created_at DESC
    `).all();
    
    // JSON文字列をパースしてオブジェクトに変換
    const parsedTriggers = triggers.map(trigger => ({
      ...trigger,
      conditions: JSON.parse(trigger.conditions),
      action: JSON.parse(trigger.action),
    }));

    res.json(parsedTriggers);
  } catch (error) {
    logger.error('Failed to get triggers:', error);
    res.status(500).json({ error: 'Failed to get triggers' });
  }
});

// トリガーの追加
router.post('/', (req, res) => {
  const { clientId, conditions, action } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO keyword_triggers (client_id, conditions, action)
      VALUES (?, ?, ?)
    `).run(
      clientId,
      JSON.stringify(conditions),
      JSON.stringify(action)
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      clientId,
      conditions,
      action,
    });
  } catch (error) {
    logger.error('Failed to create trigger:', error);
    res.status(500).json({ error: 'Failed to create trigger' });
  }
});

// トリガーの更新
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { clientId, conditions, action } = req.body;

  try {
    const result = db.prepare(`
      UPDATE keyword_triggers 
      SET client_id = ?, conditions = ?, action = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      clientId,
      JSON.stringify(conditions),
      JSON.stringify(action),
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Trigger not found' });
    }

    res.json({
      id,
      clientId,
      conditions,
      action,
    });
  } catch (error) {
    logger.error('Failed to update trigger:', error);
    res.status(500).json({ error: 'Failed to update trigger' });
  }
});

// トリガーの削除
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const result = db.prepare('DELETE FROM keyword_triggers WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Trigger not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete trigger:', error);
    res.status(500).json({ error: 'Failed to delete trigger' });
  }
});

module.exports = router;