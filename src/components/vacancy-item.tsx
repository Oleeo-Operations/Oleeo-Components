import React, { KeyboardEvent, MouseEvent } from 'react';
import { Vacancy } from '../types/Vacancy';

type VacancyItemProps = {
  vacancy: Vacancy;
  propertiesToDisplay: [
    {
      key: string;
      label: string;
      isArray: boolean;
      isHTML: boolean;
    }
  ];
  handleVacancyClick: (
    $event: MouseEvent<HTMLButtonElement>,
    vac: Vacancy
  ) => void;
};

/**
 *
 * A component to display an individual vacancy.
 * * NOTE: This is intended to be as agnostic as possible to allow styling in Webflow.
 * @param {VacancyItemProps} props
 * @return {*}  {JSX.Element}
 */
const VacancyItem = (props: VacancyItemProps): JSX.Element => {
  const { vacancy, propertiesToDisplay, handleVacancyClick } = props;
  try {
    return (
      <div className="vacancy-item">
        <div className="vacancy-item-content">
          <h2 className="vacancy-title">
            <button
              className="vacancy-title-link"
              onClick={($event: MouseEvent<HTMLButtonElement>): void => {
                return handleVacancyClick($event, vacancy);
              }}
              type="button"
            >
              {vacancy.title}
            </button>
          </h2>
          <div className="vacancy-info-item">
            <span className="item-title">Closing Date: </span>
            <span className="item-value">
              {new Intl.DateTimeFormat('en-GB').format(
                new Date(vacancy.content.closing_date)
              )}
            </span>
          </div>
          {propertiesToDisplay.map((item) => {
            if (!vacancy.content[item.key]) {
              return null;
            }
            return (
              <div className="vacancy-info-item" key={item.key}>
                <span className="item-title">{item.label}</span>
                {item.isHTML ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: vacancy.content[item.key],
                    }}
                  />
                ) : (
                  <span className="item-value">
                    {/* Check if the item is an array, if it is show it as comma separated */}
                    {item.isArray
                      ? vacancy.content[item.key].join(', ')
                      : vacancy.content[item.key]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch ($e) {
    console.error($e); // For now, just log it to the console
    return <div className="component-error">An Error Occurred.</div>;
  }
};

export default VacancyItem;
