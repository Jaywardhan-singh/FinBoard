interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry>();

export const getCached = (key: string): any | null => {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

export const setCached = (key: string, data: any, ttl: number = 30000): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

export const clearCache = (key?: string): void => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

export const getCacheKey = (url: string): string => {
  return `api:${url}`;
};
