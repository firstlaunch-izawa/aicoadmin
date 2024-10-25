const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { logger } = require('../src/lib/logger');

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'aico.db');
const MIGRATIONS_DIR = path.join(__dirname, '..', 'src', 'lib', 'db', 'migrations');

// データベースディレクトリの作成
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// データベース接続
const db = new Database(DB_PATH);

// マイグレーションテーブルの作成
db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    executed_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// マイグレーションの実行
async function runMigrations() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  // トランザクション内でマイグレーションを実行
  db.transaction(() => {
    for (const file of files) {
      const migrationName = path.basename(file);
      
      // マイグレーション済みかチェック
      const executed = db.prepare('SELECT 1 FROM migrations WHERE name = ?')
        .get(migrationName);
      
      if (!executed) {
        try {
          const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
          db.exec(sql);
          
          // マイグレーション記録
          db.prepare('INSERT INTO migrations (name) VALUES (?)')
            .run(migrationName);
          
          logger.info(`Migration executed: ${migrationName}`);
        } catch (error) {
          logger.error(`Migration failed: ${migrationName}`, error);
          throw error;
        }
      }
    }
  })();

  logger.info('All migrations completed successfully');
}

runMigrations().catch(error => {
  logger.error('Migration process failed:', error);
  process.exit(1);
});