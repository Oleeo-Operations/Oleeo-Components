import React, { KeyboardEvent, useEffect, useState } from 'react';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
  const [latestSearchTerm, setLatestSearchTerm] = useState<string>('');
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
          setLatestSearchTerm(value);
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
    $RssSubscription = rssService.getFeed(feedURL).subscribe({
      next: (response) => {
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
      <div className="search-results">
        <span aria-live="polite">
          {searchResultCategories.length} categories and{' '}
          {searchResultVacancies.length} vacancies found matching current search
          term (&quot;{latestSearchTerm}&quot;)
        </span>
        {searchResultCategories.map((cat) => {
          return <p>{cat}</p>;
        })}
        {searchResultVacancies.map((vac) => {
          return (
            <div className="search-result-vacancy">
              <h2>{vac.title}</h2>
              <span>{vac.content['directorate']}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
