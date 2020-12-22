import React from 'react';
import { CategoryDetails } from '../types/HomepageTileDetails';
import { Vacancy } from '../types/Vacancy';

type SearchResultsProps = {
  categories: CategoryDetails[];
  vacancies: Vacancy[];
  searchTerm: string;
};

/**
 * A component to display the results of the search.
 * Displays categories and vacancies which contain the search term.
 * TODO: Think about using a fuzzy search package to improve the results.
 * @param {SearchResultsProps} props
 * @return {*}  {JSX.Element}
 */
const SearchResults = (props: SearchResultsProps): JSX.Element => {
  const { categories, vacancies, searchTerm } = props;
  return (
    <>
      <div className="search-results">
        <p className="sr-only" aria-live="polite">
          {categories.length} categories and {vacancies.length} vacancies found
          matching current search term (&quot;{searchTerm}&quot;)
        </p>
        <div className="search-result-categories">
          <ul>
            {categories.map((category) => (
              <li>
                <a href={category.slug}>{category.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="search-result-vacancies">
          <ul>
            {vacancies.map((vacancy) => (
              <li className="search-result-vacancy">
                <a href={vacancy.id}>
                  <div className="vacancy-title">
                    <h3>{vacancy.title}</h3>
                    <pre>{JSON.stringify(vacancy, null, 2)}</pre>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
