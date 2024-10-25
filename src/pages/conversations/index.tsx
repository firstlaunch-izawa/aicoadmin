import { useState } from 'react';
import { Title, Card, Button } from '@tremor/react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ConversationList } from '@/components/ConversationList';
import { ConversationFilter } from '@/components/ConversationFilter';
import type { Message, Client } from '@/types';

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

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'こんにちは、何かお手伝いできることはありますか？',
    speaker: 'ai',
    timestamp: '2023-11-20T10:00:00Z',
  },
  {
    id: '2',
    content: '商品の返品について教えてください',
    speaker: 'user',
    timestamp: '2023-11-20T10:01:00Z',
  },
  {
    id: '3',
    content: '返品については、商品到着後7日以内であれば承ります。返品フォームからお手続きください。',
    speaker: 'ai',
    timestamp: '2023-11-20T10:02:00Z',
    mediaUrl: 'https://example.com/return-policy.pdf',
  },
  {
    id: '4',
    content: 'ありがとうございます',
    speaker: 'user',
    timestamp: '2023-11-21T09:00:00Z',
  },
  {
    id: '5',
    content: 'どういたしまして。他にご質問はありますか？',
    speaker: 'ai',
    timestamp: '2023-11-21T09:01:00Z',
  },
];

export default function ConversationsPage() {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(mockMessages);

  const handleFilterChange = (filters: {
    clientId?: string;
    startDate?: string;
    endDate?: string;
    keyword?: string;
  }) => {
    let filtered = mockMessages;

    if (filters.clientId) {
      setSelectedClientId(filters.clientId);
    }

    if (filters.keyword) {
      filtered = filtered.filter((message) =>
        message.content.toLowerCase().includes(filters.keyword!.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter((message) =>
        message.timestamp >= filters.startDate
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter((message) =>
        message.timestamp <= filters.endDate
      );
    }

    setFilteredMessages(filtered);
  };

  const handleDownloadCsv = () => {
    const headers = ['日時', '発言者', 'メッセージ', 'メディアURL'];
    const rows = filteredMessages.map(message => [
      new Date(message.timestamp).toLocaleString(),
      message.speaker === 'ai' ? 'AI' : 'ユーザー',
      message.content,
      message.mediaUrl || '',
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `conversations_${selectedClientId}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const selectedClient = mockClients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>会話ログ</Title>
        {filteredMessages.length > 0 && (
          <Button
            variant="secondary"
            icon={ArrowDownTrayIcon}
            onClick={handleDownloadCsv}
          >
            CSVダウンロード
          </Button>
        )}
      </div>
      
      <ConversationFilter 
        clients={mockClients}
        onFilterChange={handleFilterChange}
      />
      
      <Card className="overflow-hidden">
        {selectedClient && (
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold">
              {selectedClient.id} - {selectedClient.name}
            </h2>
          </div>
        )}
        <div className="p-4" style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
          <ConversationList messages={filteredMessages} />
        </div>
      </Card>
    </div>
  );
}