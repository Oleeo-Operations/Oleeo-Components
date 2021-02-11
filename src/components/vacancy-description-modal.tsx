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
        <div className="apply-button">
          <a
            href={vacancy.link}
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer noopener"
          >
            Apply Now
          </a>
        </div>
        <div className="vacancy-information">
          <div className="vacancy-information-column">
            <div className="vacancy-info-key">Closing Date</div>
            <div className="vacancy-info-value">
              {new Intl.DateTimeFormat('en-GB').format(
                new Date(vacancy.content.closing_date)
              )}
            </div>
          </div>
          <div className="vacancy-information-column">
            <div className="vacancy-info-key">Published </div>
            <div className="vacancy-info-value">
              {new Intl.DateTimeFormat('en-GB').format(
                new Date(vacancy.pubDate)
              )}
            </div>
          </div>
          {propertiesToDisplay.map((item) => {
            if (!vacancy.content[item.key]) {
              return null;
            }
            return (
              <div className="vacancy-information-column" key={item.key}>
                <span className="vacancy-info-key">{item.label}</span>
                {item.isHTML ? (
                  <div
                    className="vacancy-info-value"
                    dangerouslySetInnerHTML={{
                      __html: vacancy.content[item.key],
                    }}
                  />
                ) : (
                  <div className="vacancy-info-value">
                    {/* Check if the item is an array, if it is show it as comma separated */}
                    {item.isArray && Array.isArray(vacancy.content[item.key])
                      ? vacancy.content[item.key].join(', ')
                      : vacancy.content[item.key]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          className="vacancy-description"
          dangerouslySetInnerHTML={{
            __html: vacancy.content.job_description,
          }}
        />
        <div className="apply-button">
          <a
            href={vacancy.link}
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer noopener"
          >
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
