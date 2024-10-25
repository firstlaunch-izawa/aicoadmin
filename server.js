const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { logger } = require('./server/logger');
const { db } = require('./src/lib/db');
const { apiLimiter } = require('./src/lib/rateLimit');
const upload = require('./src/lib/upload');

const app = express();
const port = process.env.PORT || 3000;

// セキュリティ設定
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:4000"],
    },
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS設定
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// レート制限
app.use('/api', apiLimiter);

// 静的ファイルの提供
app.use('/uploads', express.static(upload.directory));

// APIルート
app.use('/api/health', require('./src/routes/health'));
app.use('/api/clients', require('./src/routes/clients'));
app.use('/api/messages', require('./src/routes/messages'));
app.use('/api/media', require('./src/routes/media'));
app.use('/api/metrics', require('./src/routes/metrics'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/triggers', require('./src/routes/triggers'));

// エラーハンドリング
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// サーバー起動
app.listen(port, () => {
  logger.info(`API Server is running on port ${port}`);
});

// プロセス終了時の処理
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server...');
  db.close();
  process.exit(0);
});