import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface CacheEntry {
  response: AxiosResponse;
  expiry: number;
  params: any;
}

class CacheService {
  private readonly cache: Map<string, CacheEntry> = new Map();

  private readonly cacheExpiry = 300000;

  public get(url: string): CacheEntry {
    return this.cache.get(url);
  }

  public add(url: string, response: AxiosResponse): void {
    this.cache.set(url, {
      response,
      params: response.config.params,
      expiry: Date.now() + this.cacheExpiry,
    });
  }
}

const cacheService = new CacheService();

export default cacheService;
