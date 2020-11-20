import React from 'react';
import { Vacancy } from '../types/Vacancy';

type VacancyDescriptionModalProps = {
  vacancy: Vacancy;
  propertiesToDisplay: [
    {
      key: string;
      label: string;
      isArray: boolean;
      isHTML: boolean;
    }
  ];
};

/**
 *
 * A component to display an individual vacancy, used in the modal window so is slightly different to the other one.
 * * NOTE: This is intended to be as style agnostic as possible to allow styling in Webflow.
 * @param {VacancyDescriptionModal} props
 * @return {*}  {JSX.Element}
 */
const VacancyDescriptionModal = (
  props: VacancyDescriptionModalProps
): JSX.Element => {
  const { vacancy, propertiesToDisplay } = props;
  try {
    return (
      <div className="vacancy-item">
        <h2 className="vacancy-title">{vacancy.title}</h2>
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
              <span className="item-title">{item.label}: </span>
              {item.isHTML ? (
                <div
                  // Have to use dangerouslySetInnerHTML here because, for example, the job description is a HTML string
                  // eslint-disable-next-line react/no-danger
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
        <div className="apply-button">
          <a href={vacancy.link} className="btn btn-primary">
            Apply Now
          </a>
        </div>
      </div>
    );
  } catch ($e) {
    console.error($e); // For now, just log it to the console
    return <div className="component-error">An Error Occurred.</div>;
  }
};

export default VacancyDescriptionModal;
