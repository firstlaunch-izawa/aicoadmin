import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { clientId } = req.query;
  const { start, end } = req.query;

  try {
    let query = 'SELECT * FROM messages WHERE client_id = ?';
    const params = [clientId];

    if (start) {
      query += ' AND timestamp >= ?';
      params.push(start);
    }
    if (end) {
      query += ' AND timestamp <= ?';
      params.push(end);
    }

    query += ' ORDER BY timestamp DESC LIMIT 100';

    const messages = db.prepare(query).all(...params);
    res.status(200).json(messages);
  } catch (error) {
    logger.error('Failed to get messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}