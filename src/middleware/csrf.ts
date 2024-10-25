import { NextApiRequest, NextApiResponse } from 'next';
import csrf from 'csurf';

// CSRFミドルウェアの設定
export const csrfProtection = csrf({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// CSRFトークンの検証
export function validateCsrfToken(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  return csrfProtection(req, res, next);
}