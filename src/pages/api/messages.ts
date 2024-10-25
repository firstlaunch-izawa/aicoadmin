import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { db } from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 30 * 1024 * 1024, // 30MB
    });
    
    const [fields, files] = await form.parse(req);
    
    const clientId = fields.client_id?.[0];
    const messageId = fields.message_id?.[0];
    const message = fields.message?.[0];
    const speaker = fields.speaker?.[0];
    const photo = files.photo?.[0];

    if (!clientId || !messageId || !message || !speaker) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // メッセージを保存
    const stmt = db.prepare(`
      INSERT INTO messages (id, client_id, content, speaker, timestamp, media_url)
      VALUES (?, ?, ?, ?, datetime('now'), ?)
    `);
    
    stmt.run(
      messageId,
      clientId,
      message,
      speaker,
      photo ? `/uploads/${photo.newFilename}` : null
    );

    // キーワードに基づいてメディアURLを返す（簡易実装）
    let mediaUrl = null;
    if (message.includes('商品') || message.includes('カタログ')) {
      mediaUrl = 'https://example.com/catalog.pdf';
    } else if (message.includes('店舗')) {
      mediaUrl = 'https://example.com/store.jpg';
    }

    res.status(200).json({
      status: 'success',
      mediaUrl
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}