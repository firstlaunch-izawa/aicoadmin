import { useState } from 'react';
import { Title } from '@tremor/react';
import { CustomerList } from '@/components/CustomerList';
import { CustomerFilter } from '@/components/CustomerFilter';
import { CustomerConversation } from '@/components/CustomerConversation';
import type { Customer, Message } from '@/types';

// モックデータ
const mockCustomers: Customer[] = [
  {
    id: 'aico001-000001',
    clientId: 'aico001',
    messageId: 'msg1',
    photo: 'https://example.com/photo1.jpg',
    firstContact: '2023-11-01T10:00:00Z',
    lastContact: '2023-11-20T15:30:00Z',
    totalConversations: 5,
  },
  {
    id: 'aico002-000001',
    clientId: 'aico002',
    messageId: 'msg2',
    firstContact: '2023-11-15T09:00:00Z',
    lastContact: '2023-11-20T14:20:00Z',
    totalConversations: 2,
  },
];

// モック会話データ
const mockMessages: Record<string, Message[]> = {
  'aico001-000001': [
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
    },
  ],
  'aico002-000001': [
    {
      id: '1',
      content: 'いらっしゃいませ。ご用件をお聞かせください。',
      speaker: 'ai',
      timestamp: '2023-11-20T14:00:00Z',
    },
    {
      id: '2',
      content: '営業時間を知りたいです',
      speaker: 'user',
      timestamp: '2023-11-20T14:01:00Z',
    },
    {
      id: '3',
      content: '営業時間は平日9:00-18:00となっております。',
      speaker: 'ai',
      timestamp: '2023-11-20T14:02:00Z',
    },
  ],
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const handleFilterChange = (filters: {
    clientId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    let filtered = mockCustomers;

    if (filters.clientId) {
      filtered = filtered.filter(customer =>
        customer.clientId.toLowerCase().includes(filters.clientId.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(customer =>
        customer.firstContact >= filters.startDate
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(customer =>
        customer.lastContact <= filters.endDate
      );
    }

    setCustomers(filtered);
  };

  const selectedCustomer = selectedCustomerId 
    ? customers.find(c => c.id === selectedCustomerId)
    : null;

  return (
    <div className="space-y-6">
      <Title>お客様管理</Title>
      
      <CustomerFilter onFilterChange={handleFilterChange} />
      
      {selectedCustomerId && selectedCustomer ? (
        <CustomerConversation
          customer={selectedCustomer}
          messages={mockMessages[selectedCustomerId] || []}
          onClose={() => setSelectedCustomerId(null)}
        />
      ) : (
        <CustomerList
          customers={customers}
          onViewConversation={setSelectedCustomerId}
        />
      )}
    </div>
  );
}