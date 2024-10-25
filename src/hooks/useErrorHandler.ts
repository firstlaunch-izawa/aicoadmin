import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface ErrorState {
  visible: boolean;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({
    visible: false,
    message: '',
    type: 'error'
  });

  const handleError = useCallback((error: any) => {
    logger.error('Error occurred:', error);

    let message = 'エラーが発生しました。';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    setError({
      visible: true,
      message,
      type: 'error'
    });

    // 5秒後に自動で消える
    setTimeout(() => {
      setError(prev => ({ ...prev, visible: false }));
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(prev => ({ ...prev, visible: false }));
  }, []);

  return { error, handleError, clearError };
}