import type { Client } from '@/types';

// クライアントサイドのユーティリティ関数
export function getOfflineDuration(lastPing: string): string {
  const lastPingDate = new Date(lastPing);
  const now = new Date();
  const diff = now.getTime() - lastPingDate.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 60) {
    return `${minutes}分`;
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)}時間${minutes % 60}分`;
  } else {
    return `${Math.floor(minutes / 1440)}日${Math.floor((minutes % 1440) / 60)}時間`;
  }
}

// SSEクライアントの設定
export function setupSSEClient(clientId: string, onMessage: (data: any) => void): () => void {
  const eventSource = new EventSource(`/api/sse?client_id=${clientId}`);
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Failed to parse SSE message:', error);
    }
  };

  // クリーンアップ関数を返す
  return () => {
    eventSource.close();
  };
}

// ポーリングの設定
export function setupPolling(clientId: string, onUpdate: (data: any) => void): () => void {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(`/api/polling?client_id=${clientId}`);
      const data = await response.json();
      onUpdate(data);
    } catch (error) {
      console.error('Polling failed:', error);
    }
  }, 60000); // 1分ごと

  // クリーンアップ関数を返す
  return () => {
    clearInterval(interval);
  };
}

// クライアントステータスの監視
export function useClientStatus(client: Client) {
  const [status, setStatus] = React.useState(client.status);
  const [lastPing, setLastPing] = React.useState(client.lastPing);

  React.useEffect(() => {
    const cleanup = setupPolling(client.id, (data) => {
      setStatus(data.status);
      setLastPing(data.lastPing);
    });

    return cleanup;
  }, [client.id]);

  return { status, lastPing };
}