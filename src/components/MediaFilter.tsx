import React from 'react';
import { Card, TextInput } from '@tremor/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface MediaFilterProps {
  onFilterChange: (filters: {
    filename?: string;
    clientId?: string;
  }) => void;
}

export const MediaFilter: React.FC<MediaFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    filename: '',
    clientId: '',
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          icon={MagnifyingGlassIcon}
          placeholder="ファイル名で検索"
          value={filters.filename}
          onChange={(e) => handleChange('filename', e.target.value)}
        />
        <TextInput
          icon={MagnifyingGlassIcon}
          placeholder="クライアントID (例: aico001)"
          value={filters.clientId}
          onChange={(e) => handleChange('clientId', e.target.value)}
        />
      </div>
    </Card>
  );
};