const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const { db } = require('../lib/db');
const { logger } = require('../lib/logger');
const upload = require('../lib/upload');

router.post('/', async (req, res) => {
  try {
    const form = formidable({
      maxFileSize: upload.maxSize,
      uploadDir: upload.directory,
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    const clientId = fields.client_id?.[0];
    const messageId = fields.message_id?.[0];
    const content = fields.message?.[0];
    const speaker = fields.speaker?.[0];
    const photo = files.photo?.[0];

    if (!clientId || !messageId || !content || !speaker) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mediaUrl = photo ? `/uploads/${photo.newFilename}` : null;

    const result = db.prepare(`
      INSERT INTO messages (id, client_id, content, speaker, timestamp, media_url)
      VALUES (?, ?, ?, ?, datetime('now'), ?)
    `).run(messageId, clientId, content, speaker, mediaUrl);

    res.status(201).json({
      id: messageId,
      clientId,
      content,
      speaker,
      mediaUrl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to save message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

router.get('/:clientId', (req, res) => {
  const { clientId } = req.params;
  const { start, end } = req.query;

  try {
    let query = 'SELECT * FROM messages WHERE client_id = ?';
    const params = [clientId];

    if (start) {
      query += ' AND timestamp >= ?';
      params.push(start);
    }
    if (end) {
      query += ' AND timestamp <= ?';
      params.push(end);
    }

    query += ' ORDER BY timestamp DESC LIMIT 100';

    const messages = db.prepare(query).all(...params);
    res.json(messages);
  } catch (error) {
    logger.error('Failed to get messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

module.exports = router;