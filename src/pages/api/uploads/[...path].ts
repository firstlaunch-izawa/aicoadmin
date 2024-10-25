import { NextApiRequest, NextApiResponse } from 'next';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import upload from '@/lib/upload';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path } = req.query;
    const filePath = join(upload.directory, Array.isArray(path) ? path.join('/') : path);

    // ファイルの存在確認
    try {
      statSync(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }

    // Content-Typeの設定
    const ext = filePath.split('.').pop()?.toLowerCase();
    const contentTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'pdf': 'application/pdf',
      'mp4': 'video/mp4'
    };

    const contentType = contentTypes[ext || ''] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // ファイルのストリーミング
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}