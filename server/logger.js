const fs = require('fs');
const path = require('path');

// ログディレクトリの設定
const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ログレベルの設定
const logLevel = process.env.LOG_LEVEL || 'info';
const levels = ['error', 'warn', 'info', 'debug'];
const shouldLog = (level) => levels.indexOf(level) <= levels.indexOf(logLevel);

// ログストリームの作成
const errorStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });
const accessStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}\n`;
};

const logger = {
  error: (message, meta) => {
    if (shouldLog('error')) {
      const logMessage = formatMessage('error', message, meta);
      errorStream.write(logMessage);
      console.error(logMessage);
    }
  },

  warn: (message, meta) => {
    if (shouldLog('warn')) {
      const logMessage = formatMessage('warn', message, meta);
      accessStream.write(logMessage);
      console.warn(logMessage);
    }
  },

  info: (message, meta) => {
    if (shouldLog('info')) {
      const logMessage = formatMessage('info', message, meta);
      accessStream.write(logMessage);
      console.info(logMessage);
    }
  },

  debug: (message, meta) => {
    if (shouldLog('debug')) {
      const logMessage = formatMessage('debug', message, meta);
      accessStream.write(logMessage);
      console.debug(logMessage);
    }
  }
};

module.exports = { logger };