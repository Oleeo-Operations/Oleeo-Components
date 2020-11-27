import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface CacheEntry {
  response: AxiosResponse;
  expiry: number;
  params: any;
}

class CacheService {
  private readonly cache: Map<string, CacheEntry> = new Map();

  private readonly cacheExpiry = 1000 * 60 * 30; // 30 minute;

  public get(url: string): CacheEntry {
    if (!this.cache.get(url)) {
      return JSON.parse(localStorage.getItem(url));
    }
    return this.cache.get(url);
  }

  public add(url: string, response: AxiosResponse): void {
    const cacheEntry: CacheEntry = {
      response,
      params: response.config.params,
      expiry: Date.now() + this.cacheExpiry,
    };
    this.cache.set(url, cacheEntry);
    localStorage.setItem(url, JSON.stringify(cacheEntry));
  }
}

export default new CacheService();
