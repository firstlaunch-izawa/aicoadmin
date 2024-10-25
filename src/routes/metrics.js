const express = require('express');
const router = express.Router();
const { logger } = require('../lib/logger');

router.get('/', (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    
    res.json({
      memory: {
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Failed to get metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

module.exports = router;