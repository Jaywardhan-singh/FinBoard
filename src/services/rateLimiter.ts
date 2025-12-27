interface RateLimitState {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitState>();

export const checkRateLimit = (url: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const state = rateLimitMap.get(url);

  if (!state || now > state.resetTime) {
    rateLimitMap.set(url, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (state.count >= maxRequests) {
    return false;
  }

  state.count++;
  return true;
};

export const getRateLimitResetTime = (url: string): number | null => {
  const state = rateLimitMap.get(url);
  if (!state) return null;
  return state.resetTime;
};

export const clearRateLimit = (url: string): void => {
  rateLimitMap.delete(url);
};
