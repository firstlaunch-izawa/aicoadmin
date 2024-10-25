const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// データベースディレクトリの作成
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// データベース接続
const db = new Database(path.join(dbDir, 'aico.db'));

// 初期データの投入
const setupDatabase = () => {
  const initialClient = {
    id: 'aico001',
    name: '本社受付',
    status: 'offline',
    last_ping: new Date().toISOString(),
    greeting_message: 'こんにちは、本社受付AIアシスタントです。',
  };

  try {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO clients (id, name, status, last_ping, greeting_message)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      initialClient.id,
      initialClient.name,
      initialClient.status,
      initialClient.last_ping,
      initialClient.greeting_message
    );

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();