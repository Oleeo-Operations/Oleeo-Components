import Axios, { AxiosRequestConfig } from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 *
 * A wrapper class for Axios so we can use Observables.
 *
 * @class HttpService
 */
class HttpService {
  private axios = Axios.create();
  public get<T>(url: string, config: AxiosRequestConfig = {}): Observable<T> {
    return from(this.axios.get(url, config)).pipe(
      map((response) => response.data)
    );
  }
}

export default new HttpService();
