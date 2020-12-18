import React, { KeyboardEvent, useEffect, useState } from 'react';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import rssService from '../services/rss-service';
import { Vacancy } from '../types/Vacancy';

type SearchProps = {
  feedURL: string;
  categories: string[];
};
/**
 * Component to handle search functionality.
 *
 * @return {*}  {JSX.Element}
 */
const Search = (props: SearchProps): JSX.Element => {
  const { feedURL, categories } = props;

  const searchInput: Subject<string> = new Subject();

  let $RssSubscription: Subscription;
  let $KeyupSubscription: Subscription;

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [searchResultVacancies, setSearchResultVacancies] = useState<Vacancy[]>(
    []
  );
  const [searchResultCategories, setSearchResultCategories] = useState<
    string[]
  >([]);

  const subscribeToSearchInput = (): void => {
    searchInput.pipe(debounceTime(200)).subscribe({
      next: (value: string) => {
        if (value === '') {
          setSearchResultVacancies(() => []);
          setSearchResultCategories(() => []);
        } else {
          setSearchResultVacancies(() => [
            ...vacancies.filter((vac) =>
              vac.title.toLowerCase().includes(value.toLowerCase())
            ),
          ]);
          setSearchResultCategories((): string[] =>
            categories.filter((cat) =>
              cat.toLowerCase().includes(value.toLowerCase())
            )
          );
        }
      },
    });
  };

  const handleKeyup = ($event: KeyboardEvent<HTMLInputElement>): void => {
    if (!$KeyupSubscription) {
      subscribeToSearchInput();
    }
    const target = $event.target as HTMLInputElement;
    searchInput.next(target.value);
  };

  const getVacanciesFromRSS = (): void => {
    console.log({ vacancies });
    $RssSubscription = rssService
      .getFeed(feedURL)
      .pipe(tap((x) => console.log(x)))
      .subscribe({
        next: (response) => {
          console.log({ response });
          setVacancies(response);
        },
      });
  };

  useEffect(() => {
    getVacanciesFromRSS();
    return (): void => {
      if ($RssSubscription) {
        $RssSubscription.unsubscribe();
      }
    };
  }, []);

  return (
    <div id="vacancy-search">
      <div className="search-input">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input type="text" name="search" id="search" onKeyUp={handleKeyup} />
      </div>
      {searchResultCategories.map((cat) => {
        return <p>{cat}</p>;
      })}
      {searchResultVacancies.map((vac) => {
        return <h2>{vac.title}</h2>;
      })}
    </div>
  );
};

export default Search;
