import React from 'react';
import { Card, Title, Button } from '@tremor/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ConversationList } from './ConversationList';
import type { Message, Customer } from '@/types';

interface CustomerConversationProps {
  customer: Customer;
  messages: Message[];
  onClose: () => void;
}

export const CustomerConversation: React.FC<CustomerConversationProps> = ({
  customer,
  messages,
  onClose,
}) => {
  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center">
        <Title>会話ログ - {customer.id}</Title>
        <Button
          variant="secondary"
          icon={XMarkIcon}
          onClick={onClose}
        >
          閉じる
        </Button>
      </div>
      
      <div className="border-t pt-4">
        <ConversationList messages={messages} />
      </div>
    </Card>
  );
};