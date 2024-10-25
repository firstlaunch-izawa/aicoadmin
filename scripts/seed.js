const Database = require('better-sqlite3');
const path = require('path');
const { logger } = require('../src/lib/logger');

const db = new Database(path.join(process.cwd(), 'data', 'aico.db'));

// トランザクション内でシードデータを挿入
db.transaction(() => {
  // クライアントの初期データ
  const clients = [
    {
      id: 'aico001',
      name: '本社受付',
      status: 'online',
      greeting_message: 'こんにちは、本社受付AIアシスタントです。',
    },
    {
      id: 'aico002',
      name: '支社受付',
      status: 'offline',
      greeting_message: 'いらっしゃいませ、支社受付AIアシスタントです。',
    },
  ];

  const insertClient = db.prepare(`
    INSERT OR IGNORE INTO clients (id, name, status, last_ping, greeting_message)
    VALUES (?, ?, ?, datetime('now'), ?)
  `);

  clients.forEach(client => {
    insertClient.run(client.id, client.name, client.status, client.greeting_message);
  });

  // ユーザーの初期データ
  const users = [
    {
      id: 'user001',
      first_name: '太郎',
      last_name: '山田',
      email: 'taro.yamada@example.com',
      chatwork_id: 'taro123',
    },
    {
      id: 'user002',
      first_name: '花子',
      last_name: '鈴木',
      email: 'hanako.suzuki@example.com',
      line_id: 'hanako_s',
    },
  ];

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, first_name, last_name, email, chatwork_id, line_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  users.forEach(user => {
    insertUser.run(
      user.id,
      user.first_name,
      user.last_name,
      user.email,
      user.chatwork_id || null,
      user.line_id || null
    );
  });

  logger.info('Seed data has been inserted successfully');
})();