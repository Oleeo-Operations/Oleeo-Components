import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import httpService from './http-service';
import Parser, { Item, Output } from 'rss-parser';
import { Vacancy } from '../types/Vacancy';

const parser = new Parser();

class RSSService {
  /**
   *
   * Retrieves a feed by its URL and parses it.
   * * Note: The logic is quite specific to the way regular RSS feeds are presented on vX and currently does not work with the structured feed.
   * @param {string} feedURL The URL where the feed is located
   * @return {*}  {Observable<Vacancy[]>} An observable of the list of vacancies
   * @memberof
   */
  public getFeed(feedURL: string): Observable<Vacancy[]> {
    return httpService.get(feedURL).pipe(
      switchMap((response: string) => {
        return from(parser.parseString(response)).pipe(
          map((output: Output): Vacancy[] => {
            const vacancies = output.items.map((item: Item) => {
              // Temporarily store the item in an object
              const vac: Vacancy = { ...(item as Vacancy) };

              // Split the content field by newlines then by colons to extract key=>value pairs.
              vac.content = (item.content as string)
                .split('\n')
                .map((val) => {
                  const [key, value] = val.split(':');
                  let obj: { [key: string]: string } = {};
                  obj[key] = value;
                  return obj;
                })
                .reduce((a, b) => Object.assign(a, b));
              return vac;
            });

            return vacancies;
          })
        );
      })
    );
  }
}

export default new RSSService();
