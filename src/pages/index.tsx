import { useState } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { useApi } from '@/hooks/useApi';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const { data: healthData, loading } = useApi({
    onError: (error) => console.error('Failed to fetch health data:', error)
  });

  // モックデータ生成
  const generateData = () => {
    const data = [];
    const now = new Date();
    const counts = selectedPeriod === 'daily' ? 30 : selectedPeriod === 'weekly' ? 12 : 12;
    
    for (let i = 0; i < counts; i++) {
      const date = new Date(now);
      if (selectedPeriod === 'daily') {
        date.setDate(date.getDate() - i);
      } else if (selectedPeriod === 'weekly') {
        date.setDate(date.getDate() - i * 7);
      } else {
        date.setMonth(date.getMonth() - i);
      }
      
      data.unshift({
        date: date.toLocaleDateString(),
        conversations: Math.floor(Math.random() * 50) + 10,
      });
    }
    
    return data;
  };

  return (
    <div className="space-y-6">
      <Title>ダッシュボード</Title>
      
      <Card>
        <Title>会話数推移</Title>
        <AreaChart
          className="h-72 mt-4"
          data={generateData()}
          index="date"
          categories={['conversations']}
          colors={['blue']}
        />
      </Card>

      {loading ? (
        <Card>
          <p>Loading...</p>
        </Card>
      ) : healthData ? (
        <Card>
          <Title>システム状態</Title>
          <div className="mt-4">
            <p>Status: {healthData.status}</p>
            <p>Uptime: {Math.floor(healthData.uptime / 3600)} hours</p>
          </div>
        </Card>
      ) : null}
    </div>
  );
}