import React, { KeyboardEvent, useEffect, useState } from 'react';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import Fuse from 'fuse.js';
import rssService from '../../services/rss-service';
import { CategoryDetails } from '../../types/HomepageTileDetails';
import { Vacancy } from '../../types/Vacancy';
import SearchResults from '../search-results/search-results';

type SearchProps = {
  feedURL: string;
  categories: CategoryDetails[];
};

let vacancyFuzzSearcher: Fuse<Vacancy>;
let categoryFuzzySearcher: Fuse<CategoryDetails>;

/**
 * Component to handle search functionality.
 * Contains a input field that the user can enter a search term.
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
    // Subscribe to the searchInput subject and debounce the input by 200ms
    searchInput.pipe(throttleTime(200)).subscribe({
      next: (value: string) => {
        if (value === '') {
          // If the search term is an empty string, hide everything.
          setSearchResultVacancies(() => []);
          setSearchResultCategories(() => []);
        } else {
          if (vacancyFuzzSearcher) {
            setLatestSearchTerm(value); // Set the value to the term.
            setSearchResultVacancies(() => [
              ...(vacancyFuzzSearcher
                .search(value)
                .map((result) => result.item) as Vacancy[]),
            ]);
          }
          if (categoryFuzzySearcher) {
            setSearchResultCategories((): CategoryDetails[] => [
              ...(categoryFuzzySearcher
                .search(value)
                .map((result) => result.item) as CategoryDetails[]),
            ]);
          }
        }
      },
    });
  };

  const handleKeyup = ($event: KeyboardEvent<HTMLInputElement>): void => {
    if (!$KeyupSubscription) {
      subscribeToSearchInput(); // If this doesn't already exist, do this here.
    }
    const target = $event.target as HTMLInputElement; // Cast it to a HTMLInputElement to be able to access value.
    searchInput.next(target.value);
  };

  /**
   * Do the usual and get the vacancies from the RSS Feed.
   */
  const getVacanciesFromRSS = (): void => {
    $RssSubscription = rssService.getFeed(feedURL).subscribe({
      next: (response) => {
        vacancyFuzzSearcher = new Fuse(response, {
          keys: ['title'],
          threshold: 0.4,
        });
        setVacancies(response);
      },
    });
  };

  useEffect(() => {
    getVacanciesFromRSS();
    categoryFuzzySearcher = new Fuse(categories, {
      keys: ['name'],
      threshold: 0.4,
    });
    // Return a cleanup function.
    return (): void => {
      // Unsubscribe from our Observables
      if ($RssSubscription) {
        $RssSubscription.unsubscribe();
      }
      if ($KeyupSubscription) {
        $KeyupSubscription.unsubscribe(); // If this doesn't already exist, do this here.
      }
    };
  }, []);

  return (
    <div id="vacancy-search">
      <div className="search-input">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="text"
          name="search"
          id="search-input"
          placeholder="Find your role"
          onKeyUp={handleKeyup}
        />
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
