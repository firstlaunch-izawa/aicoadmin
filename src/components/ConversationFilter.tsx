import React from 'react';
import { Card, TextInput, Select, SelectItem, Button } from '@tremor/react';
import { CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { Client } from '@/types';

interface ConversationFilterProps {
  clients: Client[];
  onFilterChange: (filters: {
    clientId?: string;
    startDate?: string;
    endDate?: string;
    keyword?: string;
  }) => void;
}

export const ConversationFilter: React.FC<ConversationFilterProps> = ({
  clients,
  onFilterChange,
}) => {
  const [filters, setFilters] = React.useState({
    clientId: '',
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59',
    keyword: '',
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // 日付と時間を組み合わせてフィルターを適用
    const combinedFilters = {
      clientId: newFilters.clientId,
      startDate: newFilters.startDate ? `${newFilters.startDate}T${newFilters.startTime}:00` : '',
      endDate: newFilters.endDate ? `${newFilters.endDate}T${newFilters.endTime}:59` : '',
      keyword: newFilters.keyword,
    };
    onFilterChange(combinedFilters);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            placeholder="クライアントを選択"
            value={filters.clientId}
            onValueChange={(value) => handleChange('clientId', value)}
          >
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.id} - {client.name}
              </SelectItem>
            ))}
          </Select>

          <TextInput
            placeholder="キーワード検索"
            value={filters.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">開始日時</label>
            <div className="flex space-x-2">
              <div className="w-40">
                <TextInput
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  icon={CalendarIcon}
                />
              </div>
              <div className="w-32">
                <TextInput
                  type="time"
                  value={filters.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">終了日時</label>
            <div className="flex space-x-2">
              <div className="w-40">
                <TextInput
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  icon={CalendarIcon}
                />
              </div>
              <div className="w-32">
                <TextInput
                  type="time"
                  value={filters.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => {
              const emptyFilters = {
                clientId: '',
                startDate: '',
                startTime: '00:00',
                endDate: '',
                endTime: '23:59',
                keyword: '',
              };
              setFilters(emptyFilters);
              onFilterChange({
                clientId: '',
                startDate: '',
                endDate: '',
                keyword: '',
              });
            }}
          >
            クリア
          </Button>
          <Button
            variant="primary"
            icon={FunnelIcon}
            onClick={() => {
              const combinedFilters = {
                clientId: filters.clientId,
                startDate: filters.startDate ? `${filters.startDate}T${filters.startTime}:00` : '',
                endDate: filters.endDate ? `${filters.endDate}T${filters.endTime}:59` : '',
                keyword: filters.keyword,
              };
              onFilterChange(combinedFilters);
            }}
          >
            フィルター適用
          </Button>
        </div>
      </div>
    </Card>
  );
};