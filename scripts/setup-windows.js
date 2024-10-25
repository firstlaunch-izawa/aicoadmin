const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 必要なディレクトリの作成
const dirs = ['data', 'uploads', 'logs'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// .env ファイルのコピー
const envExample = path.join(__dirname, '..', '.env.example');
const envFile = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envFile) && fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envFile);
}

console.log('Windows setup completed successfully!');