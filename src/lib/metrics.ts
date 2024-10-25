interface Metrics {
  [key: string]: {
    count: number;
    avg: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  };
}

class MetricsCollector {
  private metrics: Map<string, number[]> = new Map();
  private readonly MAX_SAMPLES = 1000;

  recordMetric(name: string, value: number) {
    const samples = this.metrics.get(name) || [];
    samples.push(value);
    if (samples.length > this.MAX_SAMPLES) {
      samples.shift();
    }
    this.metrics.set(name, samples);

    // パフォーマンスアラート
    if (value > 1000) {
      console.warn(`Performance alert: ${name} took ${value}ms`);
    }
  }

  getMetrics(name: string) {
    const samples = this.metrics.get(name);
    if (!samples || samples.length === 0) return null;

    const sorted = [...samples].sort((a, b) => a - b);
    return {
      avg: samples.reduce((a, b) => a + b, 0) / samples.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count: samples.length,
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  getAllMetrics(): Metrics {
    const result: Metrics = {};
    for (const [name] of this.metrics) {
      result[name] = this.getMetrics(name)!;
    }
    return result;
  }

  clear() {
    this.metrics.clear();
  }
}

export const metrics = new MetricsCollector();

// パフォーマンス監視ミドルウェア
export const metricsMiddleware = (req: any, res: any, next: () => void) => {
  const start = performance.now();
  const url = req.url;

  res.on('finish', () => {
    const duration = performance.now() - start;
    metrics.recordMetric(`${req.method} ${url}`, duration);
  });

  next();
};