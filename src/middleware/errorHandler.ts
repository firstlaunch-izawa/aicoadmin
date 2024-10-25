import { NextApiRequest, NextApiResponse } from 'next';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export function errorHandler(
  error: Error,
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  logger.error('Error occurred:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      code: error.statusCode,
    });
  }

  // 予期せぬエラーの場合
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    code: 500,
  });
}