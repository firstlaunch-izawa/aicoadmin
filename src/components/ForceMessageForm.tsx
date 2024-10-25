import React from 'react';
import { Card, TextInput, Button } from '@tremor/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Client } from '@/types';

interface ForceMessageFormProps {
  client: Client;
  onSubmit: (message: string) => void;
  onClose: () => void;
}

export const ForceMessageForm: React.FC<ForceMessageFormProps> = ({
  client,
  onSubmit,
  onClose,
}) => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          強制発話送信 - {client.id}
        </h2>
        <Button
          size="xs"
          variant="secondary"
          icon={XMarkIcon}
          onClick={onClose}
        >
          閉じる
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メッセージ
          </label>
          <TextInput
            placeholder="送信するメッセージを入力"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="submit" variant="primary" disabled={!message.trim()}>
            送信
          </Button>
        </div>
      </form>
    </Card>
  );
};