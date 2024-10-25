import React, { useState } from 'react';
import { Card, Title, Button, Select, SelectItem } from '@tremor/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TriggerList } from '@/components/TriggerList';
import { TriggerForm } from '@/components/TriggerForm';
import type { KeywordTrigger } from '@/types';

// モックデータ
const mockClients = [
  { id: 'aico001', name: 'Client 1', status: 'online' as const, lastPing: new Date().toISOString(), greetingMessage: 'Hello' },
  { id: 'aico002', name: 'Client 2', status: 'offline' as const, lastPing: new Date().toISOString(), greetingMessage: 'Hi' },
];

const mockMediaFiles = [
  { id: '1', name: 'image1.jpg', url: 'https://example.com/image1.jpg', type: 'image' as const, uploadedAt: new Date().toISOString() },
  { id: '2', name: 'video1.mp4', url: 'https://example.com/video1.mp4', type: 'video' as const, uploadedAt: new Date().toISOString() },
];

const mockUsers = [
  { id: '1', firstName: '太郎', lastName: '山田', email: 'taro@example.com', chatworkId: 'chat1' },
  { id: '2', firstName: '花子', lastName: '鈴木', email: 'hanako@example.com', chatworkId: 'chat2' },
];

const mockTriggers: KeywordTrigger[] = [
  {
    id: '1',
    clientId: 'aico001',
    conditions: [
      {
        keywords: ['こんにちは', 'hello'],
        operator: 'or' as const,
      }
    ],
    action: {
      type: 'message' as const,
      message: 'Welcome!',
    },
  },
  {
    id: '2',
    clientId: 'aico002',
    conditions: [
      {
        keywords: ['返品'],
        operator: 'and' as const,
      }
    ],
    action: {
      type: 'message' as const,
      message: '返品については7日以内であれば承ります。',
    },
  },
];

export default function TriggersPage() {
  const [showForm, setShowForm] = useState(false);
  const [triggers, setTriggers] = useState<KeywordTrigger[]>(mockTriggers);
  const [editingTrigger, setEditingTrigger] = useState<KeywordTrigger | undefined>();
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const filteredTriggers = selectedClientId
    ? triggers.filter(trigger => trigger.clientId === selectedClientId)
    : triggers;

  const handleCreateTrigger = (data: Partial<KeywordTrigger>) => {
    try {
      const newTrigger: KeywordTrigger = {
        id: String(Date.now()),
        clientId: data.clientId!,
        conditions: data.conditions!,
        action: data.action!,
      };
      setTriggers([...triggers, newTrigger]);
      setShowForm(false);
      setEditingTrigger(undefined);
    } catch (error) {
      console.error('Failed to create trigger:', error);
    }
  };

  const handleUpdateTrigger = (data: Partial<KeywordTrigger>) => {
    try {
      if (!editingTrigger) return;
      const updatedTriggers = triggers.map(trigger =>
        trigger.id === editingTrigger.id
          ? { ...trigger, ...data }
          : trigger
      );
      setTriggers(updatedTriggers);
      setShowForm(false);
      setEditingTrigger(undefined);
    } catch (error) {
      console.error('Failed to update trigger:', error);
    }
  };

  const handleDeleteTrigger = (triggerId: string) => {
    try {
      if (confirm('このトリガーを削除してもよろしいですか？')) {
        setTriggers(triggers.filter(trigger => trigger.id !== triggerId));
      }
    } catch (error) {
      console.error('Failed to delete trigger:', error);
    }
  };

  const handleEditTrigger = (trigger: KeywordTrigger) => {
    setEditingTrigger(trigger);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTrigger(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Title>キーワードトリガー</Title>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            icon={PlusIcon}
            onClick={() => {
              setEditingTrigger(undefined);
              setShowForm(true);
            }}
          >
            新規作成
          </Button>
        </div>
      </div>

      {showForm ? (
        <TriggerForm
          trigger={editingTrigger}
          clients={mockClients}
          mediaFiles={mockMediaFiles}
          users={mockUsers}
          onSubmit={editingTrigger ? handleUpdateTrigger : handleCreateTrigger}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <Card className="p-4">
            <Select
              placeholder="クライアントで絞り込み"
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectItem value="">すべて表示</SelectItem>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.id} - {client.name}
                </SelectItem>
              ))}
            </Select>
          </Card>
          <Card>
            <TriggerList
              triggers={filteredTriggers}
              onEdit={handleEditTrigger}
              onDelete={handleDeleteTrigger}
            />
          </Card>
        </>
      )}
    </div>
  );
}