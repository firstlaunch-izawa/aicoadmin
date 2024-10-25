// サーバーサイド用のロガー
import fs from 'fs';
import path from 'path';
import type { LogLevel } from '@/types';

// ログディレクトリの設定
const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
fs.mkdirSync(logDir, { recursive: true });

// ログレベルの設定
const logLevel = (process.env.LOG_LEVEL || 'info') as LogLevel;
const levels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// ログストリームの作成
const errorStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });
const accessStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

const formatMessage = (level: LogLevel, message: string, meta?: any): string => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}\n`;
};

export const logger = {
  error: (message: string, meta?: any): void => {
    if (levels[logLevel] >= levels.error) {
      const logMessage = formatMessage('error', message, meta);
      errorStream.write(logMessage);
      console.error(logMessage);
    }
  },

  warn: (message: string, meta?: any): void => {
    if (levels[logLevel] >= levels.warn) {
      const logMessage = formatMessage('warn', message, meta);
      accessStream.write(logMessage);
      console.warn(logMessage);
    }
  },

  info: (message: string, meta?: any): void => {
    if (levels[logLevel] >= levels.info) {
      const logMessage = formatMessage('info', message, meta);
      accessStream.write(logMessage);
      console.info(logMessage);
    }
  },

  debug: (message: string, meta?: any): void => {
    if (levels[logLevel] >= levels.debug) {
      const logMessage = formatMessage('debug', message, meta);
      accessStream.write(logMessage);
      console.debug(logMessage);
    }
  },
};