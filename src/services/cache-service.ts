import { AxiosResponse } from 'axios';

export interface CacheEntry {
  response: AxiosResponse;
  expiry: number;
  params: any;
}

/**
 * A class to facilitate the in-browser storage of HTTP GET requests.
 * This class stores the requests in localStorage for speedy access in subsequent
 * requests.
 * @class CacheService
 */
class CacheService {
  // An in-memory storage for HTTP Responses
  private readonly cache: Map<string, CacheEntry> = new Map();

  // The expiry time (in ms) of the cache. I.e. CacheEntries older than this force a new request.
  private readonly cacheExpiry = 1000 * 60 * 60 * 8; // 8 Hours;

  /**
   * Retrieve an entry from the cache. If not found in memory, check in the browser's localStorage.
   * @param {string} url The URL of the GET request
   * @return {*}  {CacheEntry}
   */
  public get(url: string): CacheEntry {
    console.log(this.cache);
    console.log(this.cache.get(url));
    console.log(JSON.parse(localStorage.getItem(url)));
    // TODO: Match on params too
    if (!this.cache.get(url)) {
      return JSON.parse(localStorage.getItem(url));
    }
    return this.cache.get(url);
  }

  /**
   * Add a HTTP Response to the "cache".
   * @param {string} url
   * @param {AxiosResponse} response
   * @memberof CacheService
   */
  public add(url: string, response: AxiosResponse): void {
    const cacheEntry: CacheEntry = {
      response,
      params: response.config.params,
      expiry: Date.now() + this.cacheExpiry,
    };
    this.cache.set(url, cacheEntry);
    console.log({ cacheEntry });
    localStorage.setItem(url, JSON.stringify(cacheEntry));
    console.log({ fromStorage: localStorage.getItem(url) });
  }
}

export default new CacheService();
