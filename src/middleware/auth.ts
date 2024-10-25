import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.SESSION_SECRET || 'your-secret-key';

export function validateApiKey(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

export function validateToken(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verify(token, SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}