import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { client_id, message } = req.body;

  if (!client_id || !message) {
    return res.status(400).json({ error: 'Client ID and message are required' });
  }

  try {
    // SSEクライアントにメッセージを送信
    // 実際のアプリケーションではSSE実装が必要
    res.status(200).json({
      status: 'success',
      message: 'Forced message sent',
    });
  } catch (error) {
    console.error('Error sending forced message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}