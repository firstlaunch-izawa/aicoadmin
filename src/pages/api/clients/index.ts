import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { logger } from '@/lib/serverLogger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const clients = db.prepare(`
          SELECT * FROM clients 
          ORDER BY last_ping DESC
        `).all();
        
        res.status(200).json(clients);
      } catch (error) {
        logger.error('Failed to get clients:', error);
        res.status(500).json({ error: 'Failed to get clients' });
      }
      break;

    case 'POST':
      try {
        const { id, name, greetingMessage } = req.body;
        
        const result = db.prepare(`
          INSERT INTO clients (id, name, status, last_ping, greeting_message)
          VALUES (?, ?, 'offline', datetime('now'), ?)
        `).run(id, name, greetingMessage);

        res.status(201).json({ id, name, greetingMessage });
      } catch (error) {
        logger.error('Failed to create client:', error);
        res.status(500).json({ error: 'Failed to create client' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}