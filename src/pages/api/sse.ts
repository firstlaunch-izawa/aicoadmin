import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { client_id } = req.query;

  if (!client_id) {
    return res.status(400).json({ error: 'Client ID is required' });
  }

  // SSE ヘッダーを設定
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 30秒ごとにキープアライブメッセージを送信
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
  }, 30000);

  // クライアントが切断したときにクリーンアップ
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
}