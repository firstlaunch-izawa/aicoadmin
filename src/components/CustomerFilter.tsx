import React from 'react';
import { Card, TextInput, Button } from '@tremor/react';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface CustomerFilterProps {
  onFilterChange: (filters: {
    clientId?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export const CustomerFilter: React.FC<CustomerFilterProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = React.useState({
    clientId: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <TextInput
            placeholder="クライアントID (例: aico001)"
            value={filters.clientId}
            onChange={(e) => handleChange('clientId', e.target.value)}
          />
        </div>
        <div>
          <TextInput
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            placeholder="開始日"
          />
        </div>
        <div>
          <TextInput
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            placeholder="終了日"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          variant="secondary"
          onClick={() => {
            const emptyFilters = {
              clientId: '',
              startDate: '',
              endDate: '',
            };
            setFilters(emptyFilters);
            onFilterChange(emptyFilters);
          }}
        >
          クリア
        </Button>
        <Button
          variant="primary"
          icon={FunnelIcon}
          onClick={() => onFilterChange(filters)}
        >
          フィルター適用
        </Button>
      </div>
    </Card>
  );
};