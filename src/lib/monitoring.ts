import { performance } from 'perf_hooks';
import { logger } from './logger';

class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private readonly ALERT_THRESHOLD = 1000; // 1秒
  private readonly MAX_SAMPLES = 1000;

  recordMetric(name: string, value: number) {
    const samples = this.metrics.get(name) || [];
    samples.push(value);
    if (samples.length > this.MAX_SAMPLES) {
      samples.shift();
    }
    this.metrics.set(name, samples);

    // アラートのチェック
    if (value > this.ALERT_THRESHOLD) {
      logger.warn(`Performance alert: ${name} took ${value}ms`);
    }
  }

  getMetrics(name: string) {
    const samples = this.metrics.get(name);
    if (!samples || samples.length === 0) return null;

    return {
      avg: samples.reduce((a, b) => a + b, 0) / samples.length,
      min: Math.min(...samples),
      max: Math.max(...samples),
      count: samples.length,
      p95: this.calculatePercentile(samples, 95),
      p99: this.calculatePercentile(samples, 99)
    };
  }

  private calculatePercentile(samples: number[], percentile: number) {
    const sorted = [...samples].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    for (const [name] of this.metrics) {
      result[name] = this.getMetrics(name);
    }
    return result;
  }
}

export const monitor = new PerformanceMonitor();

// パフォーマンス監視ミドルウェア
export const performanceMiddleware = (req: any, res: any, next: () => void) => {
  const start = performance.now();
  const url = req.url;

  // レスポンス完了時の処理
  res.on('finish', () => {
    const duration = performance.now() - start;
    monitor.recordMetric(`${req.method} ${url}`, duration);
  });

  next();
};