import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import Parser, { Item, Output } from 'rss-parser';
import httpService from './http-service';
import { Vacancy } from '../types/Vacancy';
import formatXML from './formatXML';

const parser = new Parser();

class RSSService {
  /**
   *
   * Retrieves a feed by its URL and parses it.
   * * Note: The logic is quite specific to the way regular RSS feeds are presented on vX and currently only works with the structured feed.
   * @param {string} feedURL The URL where the feed is located
   * @return {*}  {Observable<Vacancy[]>} An observable of the list of vacancies
   * @memberof
   */
  public getFeed(feedURL: string): Observable<Vacancy[]> {
    return httpService.get(feedURL).pipe(
      switchMap((response: string) => {
        // Turn response into desired XML using formatXML function
        return from(parser.parseString(formatXML(response))).pipe(
          map((output: Output<any>): Vacancy[] => {
            const vacancies = output.items.map((item: Item) => {
              // Temporarily store the item in an object
              const vac: Vacancy = { ...(item as Vacancy) };
              const XMLParser = new DOMParser(); // Create a new DOMParser to parse the vacancy content string
              const XMLDoc = XMLParser.parseFromString(
                vac.content as string,
                'text/html'
              );
              vac.content = {};
              // Look for the spans which contain the values
              const spans = XMLDoc.getElementsByTagName('span');
              Array.from(spans).forEach((span) => {
                // The 'itemprop' attribute contains the key for the field
                const itemprop = span.getAttribute('itemprop');
                if (vac.content[itemprop]) {
                  // If the value exists
                  if (!Array.isArray(vac.content[itemprop])) {
                    // And the value is not yet an array, we make it an array
                    vac.content[itemprop] = [vac.content[itemprop]];
                  }
                  // We add the item to the array
                  vac.content[itemprop] = vac.content[itemprop].concat([
                    span.innerHTML,
                  ]);
                } else {
                  // If it's not an array, just do key=>value pairs.
                  vac.content[itemprop] = span.innerHTML;
                }
              });
              return vac;
            });
            // Return our object
            return vacancies;
          })
        );
      })
    );
  }
}

export default new RSSService();
