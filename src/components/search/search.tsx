import React, { KeyboardEvent, useEffect, useState } from 'react';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import Fuse from 'fuse.js';
import rssService from '../../services/rss-service';
import { CategoryDetails } from '../../types/HomepageTileDetails';
import { Vacancy } from '../../types/Vacancy';
import SearchResults from '../search-results/search-results';
import './search.scss';

type SearchProps = {
  feedURL: string;
  categories: CategoryDetails[];
  propertiesToDisplay: [
    {
      key: string;
      label: string;
      isArray: boolean;
      isHTML: boolean;
    }
  ];
  fuzzSearchThreshold: number;
  fuzzySearchKeys: string[];
};

// The FuseJS Fuzzy Searcher for Vacancies
let vacancyFuzzySearcher: Fuse<Vacancy>;

// The FuseJS Fuzzy Searcher for Categories
let categoryFuzzySearcher: Fuse<CategoryDetails>;

/**
 * Component to handle search functionality.
 * Contains a input field that the user can enter a search term.
 * @return {*}  {JSX.Element}
 */
const Search = (props: SearchProps): JSX.Element => {
  const {
    feedURL,
    categories,
    fuzzSearchThreshold,
    fuzzySearchKeys,
    propertiesToDisplay,
  } = props;

  // An RxJS Subject for the searchInput. This will emit after data has been entered into the input.
  const searchInput: Subject<string> = new Subject();

  // Create some RxJS Subscriptions. These will be initialised later.
  let $RssSubscription: Subscription;
  let $KeyupSubscription: Subscription;

  // A state variable for the latestSearchTerm
  const [latestSearchTerm, setLatestSearchTerm] = useState<string>('');

  // A state variable for the Vacancies which the Fuzzy Search returns
  const [searchResultVacancies, setSearchResultVacancies] = useState<Vacancy[]>(
    []
  );

  // A state variable for the Categories which the Fuzzy Search returns
  const [searchResultCategories, setSearchResultCategories] = useState<
    CategoryDetails[]
  >([]);

  // A state variable for whether the results dropdown is active.
  // TODO: Maybe consider not using a boolean flag.
  const [searchResultsActive, setSearchResultsActive] = useState<boolean>(
    false
  );

  const subscribeToSearchInput = (): void => {
    // Subscribe to the searchInput subject and debounce the input by 200ms
    searchInput.pipe(throttleTime(200)).subscribe({
      next: (value: string) => {
        if (value === '') {
          // If the search term is an empty string, hide everything.
          setSearchResultVacancies(() => []);
          setSearchResultCategories(() => []);
          setSearchResultsActive(false);
          return;
        }
        if (vacancyFuzzySearcher && categoryFuzzySearcher) {
          setSearchResultsActive(true); // Show the dropdown thingy
          setLatestSearchTerm(value); // Set the value to the term.
          // Run the vacancyFuzzySearcher and update the state variable
          setSearchResultVacancies(() => [
            ...(vacancyFuzzySearcher
              .search(value)
              .map((result) => result.item) as Vacancy[]),
          ]);

          // Run the category and update the state variable
          setSearchResultCategories((): CategoryDetails[] => [
            ...(categoryFuzzySearcher
              .search(value)
              .map((result) => result.item) as CategoryDetails[]),
          ]);
        } else {
          console.warn('Tried to search but there were no FuzzySearchers');
        }
      },
    });
  };

  const handleKeyup = ($event: KeyboardEvent<HTMLInputElement>): void => {
    if (!$KeyupSubscription) {
      subscribeToSearchInput(); // If this doesn't already exist, do this here.
    }
    const target = $event.target as HTMLInputElement; // Cast it to a HTMLInputElement to be able to access value.
    // TODO: Perform some validation on this.
    searchInput.next(target.value); // Emit the value of the search input
  };

  /**
   * Do the usual and get the vacancies from the RSS Feed.
   * TODO: Add in some error handling
   */
  const getVacanciesFromRSS = (): void => {
    $RssSubscription = rssService.getFeed(feedURL).subscribe({
      next: (response) => {
        vacancyFuzzySearcher = new Fuse(response, {
          keys: fuzzySearchKeys,
          threshold: fuzzSearchThreshold || 0.6,
        });
      },
    });
  };

  const handleSearchResultClose = (): void => {
    // This function is passed as a prop to the SearchResults component.
    // It is called whenever a user presses 'Escape' or clicks on the overlay.
    setSearchResultsActive(false);
  };

  useEffect(() => {
    getVacanciesFromRSS();
    categoryFuzzySearcher = new Fuse(categories, {
      keys: ['name'],
      threshold: fuzzSearchThreshold || 0.4,
    });
    // Return a cleanup function.
    return (): void => {
      // Unsubscribe from our Observables
      if ($RssSubscription) {
        $RssSubscription.unsubscribe();
      }
      if ($KeyupSubscription) {
        $KeyupSubscription.unsubscribe();
      }
    };
  }, []);

  return (
    <div className="vacancy-search">
      <div className="search-input">
        {/* Accessibility is important! We include a label, but hide it visually. */}
        <label htmlFor="search" className="sr-only">
          Search for a job. Results will appear when you type.
        </label>
        <input
          type="text"
          name="search"
          className="vacancy-search-input"
          placeholder="Find your role"
          onKeyUp={handleKeyup}
        />
      </div>
      <SearchResults
        categories={searchResultCategories}
        vacancies={searchResultVacancies}
        searchTerm={latestSearchTerm}
        isActive={searchResultsActive}
        handleClose={handleSearchResultClose}
        propertiesToDisplay={propertiesToDisplay}
      />
    </div>
  );
};

export default Search;
