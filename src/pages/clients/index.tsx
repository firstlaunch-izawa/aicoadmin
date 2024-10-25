import { useState } from 'react';
import { Title, Button } from '@tremor/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ClientList } from '@/components/ClientList';
import { ClientForm } from '@/components/ClientForm';
import { FailureLogList } from '@/components/FailureLogList';
import { ForceMessageForm } from '@/components/ForceMessageForm';
import type { Client, PollingFailureLog } from '@/types';

// モックデータ
const mockClients: Client[] = [
  {
    id: 'aico001',
    name: '本社受付',
    status: 'online',
    lastPing: '2023-11-20T10:00:00Z',
    greetingMessage: 'こんにちは、本社受付AIアシスタントです。',
  },
  {
    id: 'aico002',
    name: '支社受付',
    status: 'offline',
    lastPing: '2023-11-20T09:55:00Z',
    greetingMessage: 'いらっしゃいませ、支社受付AIアシスタントです。',
  },
];

// モック失敗ログ
const mockFailureLogs: Record<string, PollingFailureLog[]> = {
  'aico001': [
    {
      id: '1',
      clientId: 'aico001',
      timestamp: '2023-11-20T10:05:00Z',
      errorMessage: 'ポーリング応答がタイムアウトしました',
    },
    {
      id: '2',
      clientId: 'aico001',
      timestamp: '2023-11-20T10:08:00Z',
      errorMessage: 'ポーリング接続に失敗しました',
    },
  ],
  'aico002': [
    {
      id: '3',
      clientId: 'aico002',
      timestamp: '2023-11-20T09:58:00Z',
      errorMessage: 'ポーリング応答がタイムアウトしました',
    },
  ],
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFailureLogClientId, setSelectedFailureLogClientId] = useState<string | null>(null);
  const [forceMessageClient, setForceMessageClient] = useState<Client | null>(null);

  const handleSubmit = (data: Partial<Client>) => {
    // IDの完全な形式を構築
    const fullId = data.id?.startsWith('aico') ? data.id : `aico${data.id}`;
    
    if (selectedClient) {
      // 編集
      setClients(clients.map(client =>
        client.id === selectedClient.id
          ? { ...client, ...data, id: fullId }
          : client
      ));
    } else {
      // 新規作成
      const newClient: Client = {
        ...data as Client,
        id: fullId,
        status: 'offline',
        lastPing: new Date().toISOString(),
      };
      setClients([...clients, newClient]);
    }
    setIsFormOpen(false);
    setSelectedClient(null);
  };

  const handleDelete = (clientId: string) => {
    if (confirm('このクライアント端末を削除してもよろしいですか？')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const handleDownloadCsv = (clientId: string) => {
    const logs = mockFailureLogs[clientId] || [];
    const headers = ['日時', 'エラーメッセージ'];
    const rows = logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.errorMessage,
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `failure_logs_${clientId}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSendForceMessage = async (message: string) => {
    if (!forceMessageClient) return;

    try {
      const response = await fetch('/api/force-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: forceMessageClient.id,
          message,
        }),
      });

      if (response.ok) {
        alert('強制発話メッセージを送信しました');
        setForceMessageClient(null);
      } else {
        throw new Error('Failed to send force message');
      }
    } catch (error) {
      console.error('Error sending force message:', error);
      alert('メッセージの送信に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>クライアント端末管理</Title>
        <Button
          variant="primary"
          icon={PlusIcon}
          onClick={() => {
            setSelectedClient(null);
            setIsFormOpen(true);
          }}
        >
          新規aico追加
        </Button>
      </div>

      {isFormOpen ? (
        <ClientForm
          client={selectedClient || undefined}
          existingIds={clients.map(c => c.id)}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedClient(null);
          }}
        />
      ) : selectedFailureLogClientId ? (
        <FailureLogList
          clientId={selectedFailureLogClientId}
          logs={mockFailureLogs[selectedFailureLogClientId] || []}
          onDownloadCsv={() => handleDownloadCsv(selectedFailureLogClientId)}
          onClose={() => setSelectedFailureLogClientId(null)}
        />
      ) : forceMessageClient ? (
        <ForceMessageForm
          client={forceMessageClient}
          onSubmit={handleSendForceMessage}
          onClose={() => setForceMessageClient(null)}
        />
      ) : (
        <ClientList
          clients={clients}
          onEdit={(client) => {
            setSelectedClient(client);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
          onViewFailureLogs={setSelectedFailureLogClientId}
          onSendForceMessage={setForceMessageClient}
        />
      )}
    </div>
  );
}