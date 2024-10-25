// クライアントサイド用のロガー
import type { LogLevel } from '@/types';

class Logger {
  private logLevel: LogLevel = 'info';
  private levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog('error')) {
      const logMessage = this.formatMessage('error', message, meta);
      console.error(logMessage);
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog('warn')) {
      const logMessage = this.formatMessage('warn', message, meta);
      console.warn(logMessage);
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog('info')) {
      const logMessage = this.formatMessage('info', message, meta);
      console.info(logMessage);
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog('debug')) {
      const logMessage = this.formatMessage('debug', message, meta);
      console.debug(logMessage);
    }
  }

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export const logger = new Logger();