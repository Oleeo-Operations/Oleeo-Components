import React from 'react';
import { CategoryDetails } from '../../types/HomepageTileDetails';
import { Vacancy } from '../../types/Vacancy';

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
            <ul className="search-result-categories-list">
              {categories.map((category) => (
                <li key={category.name} className="search-result-category">
                  <a
                    href={`/roles/${category.slug}`}
                    dangerouslySetInnerHTML={{ __html: category.name }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="search-result-vacancies">
            <ul className="search-result-vacancy-list">
              {vacancies.map((vacancy) => (
                <li className="search-result-vacancy" key={vacancy.id}>
                  <a href={vacancy.id}>
                    <span className="vacancy-title">{vacancy.title}</span>
                    <div className="vacancy-details">
                      <span className="closing-date">
                        Closing Date:
                        {new Intl.DateTimeFormat('en-GB').format(
                          new Date(vacancy.content.closing_date)
                        )}
                      </span>
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
