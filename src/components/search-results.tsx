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
      {(categories.length > 0 || vacancies.length > 0) && (
        <div
          className="search-results"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            background: '#fff',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,.3)',
            maxHeight: '300px',
            overflowY: 'scroll',
            zIndex: 999,
          }}
        >
          <p className="sr-only" aria-live="polite">
            {categories.length} categories and {vacancies.length} vacancies
            found matching current search term (&quot;{searchTerm}&quot;)
          </p>
          <div className="search-result-categories">
            <ul>
              {categories.map((category) => (
                <li key={category.name}>
                  <a href={`/roles/${category.slug}`}>{category.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="search-result-vacancies">
            <ul>
              {vacancies.map((vacancy) => (
                <li className="search-result-vacancy" key={vacancy.id}>
                  <a href={vacancy.id}>
                    <div className="vacancy-title">
                      <h3>{vacancy.title}</h3>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;
