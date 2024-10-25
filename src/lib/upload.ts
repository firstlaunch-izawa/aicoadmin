import { mkdirSync } from 'fs';
import path from 'path';

// アップロードディレクトリの設定
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// ディレクトリが存在しない場合は作成
mkdirSync(uploadDir, { recursive: true });

export const getUploadPath = (filename: string) => {
  return path.join(uploadDir, filename);
};

export const getPublicUrl = (filename: string) => {
  return `/uploads/${filename}`;
};

export default {
  directory: uploadDir,
  maxSize: parseInt(process.env.MAX_UPLOAD_SIZE || '30000000', 10),
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4']
};