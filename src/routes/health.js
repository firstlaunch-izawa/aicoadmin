const express = require('express');
const router = express.Router();
const { db } = require('../lib/db');
const { logger } = require('../lib/logger');

router.get('/', async (req, res) => {
  try {
    // データベース接続チェック
    db.prepare('SELECT 1').get();
    
    // メモリ使用量チェック
    const memoryUsage = process.memoryUsage();
    const heapUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: `${heapUsed}MB`,
        heapTotal: `${heapTotal}MB`,
        percentage: `${Math.round((heapUsed / heapTotal) * 100)}%`
      }
    };

    res.json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router;