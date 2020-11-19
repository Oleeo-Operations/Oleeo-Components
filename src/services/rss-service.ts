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
              const XMLParser = new DOMParser();
              let XMLDoc = XMLParser.parseFromString(
                vac.content as string,
                'text/html'
              );
              vac.content = {};
              let spans = XMLDoc.getElementsByTagName('span');
              Array.from(spans).forEach((span) => {
                const itemprop = span.getAttribute('itemprop');
                if (vac.content[itemprop]) {
                  if (!Array.isArray(vac.content[itemprop])) {
                    vac.content[itemprop] = [vac.content[itemprop]];
                  }
                  vac.content[itemprop] = vac.content[itemprop].concat([
                    span.innerHTML,
                  ]);
                } else {
                  vac.content[itemprop] = span.innerHTML;
                }
              });
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
