const path = require('path');
const fs = require('fs');

// アップロードディレクトリの設定
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// ディレクトリが存在しない場合は作成
fs.mkdirSync(uploadDir, { recursive: true });

module.exports = {
  directory: uploadDir,
  maxSize: parseInt(process.env.MAX_UPLOAD_SIZE || '30000000', 10), // 30MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4']
};