import React, { KeyboardEvent, useEffect, useState } from 'react';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import rssService from '../services/rss-service';
import { CategoryDetails } from '../types/HomepageTileDetails';
import { Vacancy } from '../types/Vacancy';
import SearchResults from './search-results';

type SearchProps = {
  feedURL: string;
  categories: CategoryDetails[];
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
    CategoryDetails[]
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
          setSearchResultCategories((): CategoryDetails[] =>
            categories.filter((cat) =>
              cat.name.toLowerCase().includes(value.toLowerCase())
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
      <SearchResults
        categories={searchResultCategories}
        vacancies={searchResultVacancies}
        searchTerm={latestSearchTerm}
      />
    </div>
  );
};

export default Search;
