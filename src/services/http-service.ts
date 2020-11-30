import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
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
        return request;
      }

      if (cachedResponse.expiry < Date.now()) {
        return request;
      }

      request.adapter = (): Promise<any> =>
        Promise.resolve({
          data: cachedResponse.response.data,
          headers: request.headers,
          config: request,
          request,
          status: 200,
          statusText: '',
        });
      return request;
    });

    this.axios.interceptors.response.use((response: AxiosResponse) => {
      if (response.request.responseURL) {
        cacheService.add(response.request.responseURL, response);
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
