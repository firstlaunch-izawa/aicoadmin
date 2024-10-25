import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { client_id } = req.query;

  if (!client_id || typeof client_id !== 'string') {
    return res.status(400).json({ error: 'Client ID is required' });
  }

  try {
    // クライアントの状態を更新
    const updateStmt = db.prepare(`
      UPDATE clients 
      SET status = 'online', last_ping = datetime('now')
      WHERE id = ?
    `);
    updateStmt.run(client_id);

    // 挨拶メッセージを取得
    const getStmt = db.prepare(`
      SELECT greeting_message 
      FROM clients 
      WHERE id = ?
    `);
    const result = getStmt.get(client_id);

    res.status(200).json({
      status: 'success',
      greeting: result?.greeting_message || 'こんにちは、何かお手伝いできることはありますか？'
    });
  } catch (error) {
    console.error('Error processing polling:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}