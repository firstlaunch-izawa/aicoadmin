import axios from 'axios';

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
    console.error('API Request Error:', error);
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

export const api = {
  // クライアント関連
  getClients: () => apiClient.get('/clients'),
  updateClient: (id: string, data: any) => apiClient.put(`/clients/${id}`, data),

  // メッセージ関連
  sendMessage: async (formData: FormData) => {
    const response = await apiClient.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // メディア関連
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ヘルスチェック
  getHealth: () => apiClient.get('/health'),

  // メトリクス
  getMetrics: () => apiClient.get('/metrics'),
};