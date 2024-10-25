import Database from 'better-sqlite3';
import path from 'path';

// このファイルはサーバーサイドでのみ使用されます
if (typeof window === 'undefined') {
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'aico.db');
  const db = new Database(dbPath);

  // セキュリティ設定
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  export { db };
} else {
  // クライアントサイドでは空のオブジェクトをエクスポート
  export const db = {};
}