import axios, { AxiosError, AxiosInstance } from 'axios';
import { getCached, setCached, getCacheKey, clearCache } from './cache';
import { checkRateLimit, getRateLimitResetTime } from './rateLimiter';
import { adaptApiResponse, AdapterResult } from './adapter';

export interface ApiClientConfig {
  cacheEnabled?: boolean;
  cacheTTL?: number;
  rateLimitEnabled?: boolean;
  maxRequests?: number;
  windowMs?: number;
}

class ApiClient {
  private client: AxiosInstance;
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTTL: config.cacheTTL ?? 30000,
      rateLimitEnabled: config.rateLimitEnabled ?? true,
      maxRequests: config.maxRequests ?? 10,
      windowMs: config.windowMs ?? 60000,
    };

    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async fetch(url: string, useCache: boolean = true): Promise<AdapterResult> {
    const cacheKey = getCacheKey(url);

    if (useCache && this.config.cacheEnabled) {
      const cached = getCached(cacheKey);
      if (cached) {
        return adaptApiResponse(cached);
      }
    }

    if (this.config.rateLimitEnabled) {
      const allowed = checkRateLimit(url, this.config.maxRequests, this.config.windowMs);
      if (!allowed) {
        const resetTime = getRateLimitResetTime(url);
        return {
          success: false,
          error: `Rate limit exceeded. Try again after ${resetTime ? new Date(resetTime).toLocaleTimeString() : 'some time'}`,
        };
      }
    }

    try {
      const response = await this.client.get(url);
      
      if (useCache && this.config.cacheEnabled) {
        setCached(cacheKey, response.data, this.config.cacheTTL);
      }

      return adaptApiResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response) {
          if (axiosError.response.status === 429) {
            return {
              success: false,
              error: 'Rate limit exceeded. Please try again later.',
            };
          }
          
          return {
            success: false,
            error: `API error: ${axiosError.response.status} ${axiosError.response.statusText}`,
          };
        }
        
        if (axiosError.request) {
          return {
            success: false,
            error: 'Network error. Please check your connection and API URL.',
          };
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async testConnection(url: string): Promise<AdapterResult> {
    return this.fetch(url, false);
  }

  clearCacheForUrl(url: string): void {
    clearCache(getCacheKey(url));
  }
}

export const apiClient = new ApiClient();
