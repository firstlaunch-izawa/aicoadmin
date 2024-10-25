import type { NextApiRequest, NextApiResponse } from 'next';
import { metrics } from '@/lib/metrics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const metricsData = metrics.getAllMetrics();
    const memoryUsage = process.memoryUsage();

    res.status(200).json({
      metrics: metricsData,
      memory: {
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Failed to get metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
}