import axios from 'axios';
import { logger } from './logger';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    // CSRFトークンの追加
    const token = window.csrfToken;
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 認証エラー時の処理
          window.location.href = '/login';
          break;
        case 403:
          // 権限エラー時の処理
          break;
        case 429:
          // レート制限時の処理
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;