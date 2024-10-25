-- クライアントテーブル
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT CHECK(status IN ('online', 'offline')) NOT NULL,
  last_ping TEXT NOT NULL,
  greeting_message TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_last_ping ON clients(last_ping);

-- メッセージテーブル
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  content TEXT NOT NULL,
  speaker TEXT CHECK(speaker IN ('user', 'ai')) NOT NULL,
  timestamp TEXT NOT NULL,
  media_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_messages_client_id ON messages(client_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- キーワードトリガーテーブル
CREATE TABLE IF NOT EXISTS keyword_triggers (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  conditions TEXT NOT NULL, -- JSON形式で保存
  action TEXT NOT NULL, -- JSON形式で保存
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_keyword_triggers_client_id ON keyword_triggers(client_id);

-- 失敗ログテーブル
CREATE TABLE IF NOT EXISTS failure_logs (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  error_message TEXT NOT NULL,
  request_data TEXT,
  response_data TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE INDEX idx_failure_logs_client_id ON failure_logs(client_id);
CREATE INDEX idx_failure_logs_timestamp ON failure_logs(timestamp);