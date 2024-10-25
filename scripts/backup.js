const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { logger } = require('../src/lib/logger');

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'aico.db');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// バックアップディレクトリの作成
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// データベースのバックアップ
function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `db-backup-${timestamp}.sqlite`);

  exec(`sqlite3 ${DB_PATH} ".backup '${backupPath}'"`, (error, stdout, stderr) => {
    if (error) {
      logger.error('Database backup failed:', error);
      return;
    }
    logger.info('Database backup completed:', backupPath);
  });
}

// メディアファイルのバックアップ
function backupMedia() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `media-backup-${timestamp}`);

  exec(`tar -czf ${backupPath}.tar.gz ${UPLOAD_DIR}`, (error, stdout, stderr) => {
    if (error) {
      logger.error('Media backup failed:', error);
      return;
    }
    logger.info('Media backup completed:', backupPath);
  });
}

// 古いバックアップの削除
function cleanOldBackups() {
  const MAX_BACKUPS = 7; // 1週間分のバックアップを保持

  fs.readdir(BACKUP_DIR, (err, files) => {
    if (err) {
      logger.error('Failed to read backup directory:', err);
      return;
    }

    // データベースバックアップの整理
    const dbBackups = files.filter(f => f.startsWith('db-backup-')).sort();
    if (dbBackups.length > MAX_BACKUPS) {
      dbBackups.slice(0, -MAX_BACKUPS).forEach(file => {
        fs.unlinkSync(path.join(BACKUP_DIR, file));
        logger.info('Removed old database backup:', file);
      });
    }

    // メディアバックアップの整理
    const mediaBackups = files.filter(f => f.startsWith('media-backup-')).sort();
    if (mediaBackups.length > MAX_BACKUPS) {
      mediaBackups.slice(0, -MAX_BACKUPS).forEach(file => {
        fs.unlinkSync(path.join(BACKUP_DIR, file));
        logger.info('Removed old media backup:', file);
      });
    }
  });
}

// バックアップの実行
backupDatabase();
backupMedia();
cleanOldBackups();