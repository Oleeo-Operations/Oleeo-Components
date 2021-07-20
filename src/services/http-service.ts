import Axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import cacheService from './cache-service';

/**
 *
 * A wrapper class for Axios so we can use Observables.
 *
 * @class HttpService
 */
class HttpService {
  private axios = Axios.create();

  constructor() {
    this.axios.interceptors.request.use((request) => {
      const url = this.axios.getUri(request);

      if (request.method.toLowerCase() !== 'get') {
        return request;
      }

      const cachedResponse = cacheService.get(url);

      if (!cachedResponse) {
        console.log(`No cache for ${url}`);
        return request;
      }

      if (cachedResponse.expiry < Date.now()) {
        console.log(`Cache expired for ${url}`);
        return request;
      }

      request.adapter = (): AxiosPromise<unknown> =>
        Promise.resolve({
          data: cachedResponse.response.data,
          headers: request.headers,
          config: request,
          request,
          // mark the response as cached so we don't end up re-adding it to the cache
          // and thus keep changing its expiration indefinetely
          status: 304,
          statusText: '',
        });

      console.log(`Using cached response for ${url}`);
      return request;
    });

    this.axios.interceptors.response.use((response: AxiosResponse) => {
      if (response.status !== 304 && response.request.responseURL) {
        cacheService.add(response.request.responseURL, response);
      } else if (response.status !== 304 && response.config.url) {
        cacheService.add(response.config.url, response);
      }
      return response;
    });
  }

  public get<T>(url: string, config: AxiosRequestConfig = {}): Observable<T> {
    return from(this.axios.get(url, config)).pipe(
      map((response) => response.data)
    );
  }
}

export default new HttpService();
