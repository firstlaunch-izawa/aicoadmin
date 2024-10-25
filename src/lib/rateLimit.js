const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // IPアドレスごとの最大リクエスト数
  message: { error: 'Too many requests, please try again later.' }
});

module.exports = { apiLimiter };