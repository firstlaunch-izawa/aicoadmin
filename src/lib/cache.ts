import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 600, // 10分
  checkperiod: 120, // 2分ごとに期限切れをチェック
});

export const cacheMiddleware = (duration: number) => {
  return (req: any, res: any, next: () => void) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    res.originalJson = res.json;
    res.json = (body: any) => {
      cache.set(key, body, duration);
      res.originalJson(body);
    };
    next();
  };
};

export const clearCache = (pattern: string) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  cache.del(matchingKeys);
};