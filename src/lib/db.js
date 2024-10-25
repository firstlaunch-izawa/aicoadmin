const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { logger } = require('./logger');

// データベースディレクトリの作成
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dbDir, 'aico.db');
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV !== 'production' ? console.log : undefined
});

// セキュリティ設定
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// データベースの初期化
function initializeDatabase() {
  const queries = [
    // クライアントテーブル
    `CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT CHECK(status IN ('online', 'offline')) NOT NULL,
      last_ping TEXT NOT NULL,
      greeting_message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    'CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status)',
    'CREATE INDEX IF NOT EXISTS idx_clients_last_ping ON clients(last_ping)',

    // メッセージテーブル
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      content TEXT NOT NULL,
      speaker TEXT CHECK(speaker IN ('user', 'ai')) NOT NULL,
      timestamp TEXT NOT NULL,
      media_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )`,
    'CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id)',
    'CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)',

    // キーワードトリガーテーブル
    `CREATE TABLE IF NOT EXISTS keyword_triggers (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      conditions TEXT NOT NULL,
      action TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )`,
    'CREATE INDEX IF NOT EXISTS idx_keyword_triggers_client_id ON keyword_triggers(client_id)',

    // 失敗ログテーブル
    `CREATE TABLE IF NOT EXISTS failure_logs (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      error_message TEXT NOT NULL,
      request_data TEXT,
      response_data TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )`,
    'CREATE INDEX IF NOT EXISTS idx_failure_logs_client_id ON failure_logs(client_id)',
    'CREATE INDEX IF NOT EXISTS idx_failure_logs_timestamp ON failure_logs(timestamp)'
  ];

  // トランザクション内でクエリを実行
  db.transaction(() => {
    queries.forEach(query => {
      try {
        db.prepare(query).run();
      } catch (error) {
        logger.error('Error executing query:', { query, error });
        throw error;
      }
    });
  })();

  logger.info('Database initialized successfully');
}

// 初回起動時にデータベースを初期化
try {
  initializeDatabase();
} catch (error) {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
}

module.exports = { db };