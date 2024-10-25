import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const users = db.prepare('SELECT * FROM users ORDER BY last_name, first_name').all();
        res.status(200).json(users);
      } catch (error) {
        logger.error('Failed to get users:', error);
        res.status(500).json({ error: 'Failed to get users' });
      }
      break;

    case 'POST':
      try {
        const { firstName, lastName, email, chatworkId, lineId } = req.body;
        
        const result = db.prepare(`
          INSERT INTO users (first_name, last_name, email, chatwork_id, line_id)
          VALUES (?, ?, ?, ?, ?)
        `).run(firstName, lastName, email, chatworkId, lineId);

        res.status(201).json({
          id: result.lastInsertRowid,
          firstName,
          lastName,
          email,
          chatworkId,
          lineId,
        });
      } catch (error) {
        logger.error('Failed to create user:', error);
        res.status(500).json({ error: 'Failed to create user' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}