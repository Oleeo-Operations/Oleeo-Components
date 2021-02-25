/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { CategoryDetails } from '../../types/HomepageTileDetails';
import { Vacancy } from '../../types/Vacancy';
import './search-results.scss';

type SearchResultsProps = {
  categories: CategoryDetails[];
  vacancies: Vacancy[];
  propertiesToDisplay: [
    {
      key: string;
      label: string;
      isArray: boolean;
      isHTML: boolean;
    }
  ];
  searchTerm: string;
  isActive: boolean;
  handleClose: () => void;
};

/**
 * A component to display the results of the search.
 * Displays categories and vacancies which contain the search term.
 * TODO: Think about using a fuzzy search package to improve the results.
 * @param {SearchResultsProps} props
 * @return {*}  {JSX.Element}
 */
const SearchResults = (props: SearchResultsProps): JSX.Element => {
  const {
    categories,
    vacancies,
    searchTerm,
    isActive,
    handleClose,
    propertiesToDisplay,
  } = props;

  let $KeyupSubscription: Subscription;

  const handleOverlayClick = (): void => {
    handleClose();
  };

  const handleKeyUp = (
    $event: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>
  ): void => {
    if ($event.key === 'Escape' && isActive) {
      handleClose();
    }
  };

  useEffect(() => {
    $KeyupSubscription = fromEvent(window, 'keyup').subscribe({
      next: ($event: KeyboardEvent): void => {
        handleKeyUp($event);
      },
    });

    return (): void => {
      if ($KeyupSubscription) {
        $KeyupSubscription.unsubscribe();
      }
    };
  });

  return (
    <>
      {(categories.length > 0 || vacancies.length > 0) && isActive && (
        <>
          <div
            className="search-results-overlay"
            onClick={(): void => handleOverlayClick()}
            onKeyUp={($event): void => handleKeyUp($event)}
            role="button"
            tabIndex={0}
            aria-label="Close search results (press Escape or click to close)"
          />
          <div className="search-results">
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
                        <div className="closing-date vacancy-property">
                          <span className="property-title">Closing Date:</span>
                          <span className="property-value">
                            {new Intl.DateTimeFormat('en-GB').format(
                              new Date(vacancy.content.closing_date)
                            )}
                          </span>
                        </div>
                        <div className="vacancy-properties">
                          {propertiesToDisplay.map((property) => {
                            if (!vacancy.content[property.key]) {
                              return null;
                            }
                            return (
                              <div
                                className="vacancy-property"
                                key={property.key}
                              >
                                <span className="property-title">
                                  {property.label}
                                </span>
                                {property.isHTML ? (
                                  <div
                                    className="property-value"
                                    dangerouslySetInnerHTML={{
                                      __html: vacancy.content[property.key],
                                    }}
                                  />
                                ) : (
                                  <span className="item-value">
                                    {/* Check if the item is an array, if it is show it as comma separated */}
                                    {property.isArray &&
                                    Array.isArray(vacancy.content[property.key])
                                      ? vacancy.content[property.key].join(', ')
                                      : vacancy.content[property.key]}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchResults;
