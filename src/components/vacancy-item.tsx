import React from 'react';
import { Vacancy } from '../types/Vacancy';

type VacancyItemProps = {
  vacancy: Vacancy;
};

/**
 *
 * A component to display an individual vacancy.
 * * NOTE: This is intended to be as agnostic as possible to allow styling in Webflow.
 * @param {VacancyItemProps} props
 * @return {*}  {JSX.Element}
 */
const VacancyItem = (props: VacancyItemProps): JSX.Element => {
  const { vacancy } = props;
  return (
    <div>
      <h2>{vacancy.title}</h2>
      <pre>{JSON.stringify(vacancy, null, 4)}</pre>
    </div>
  );
};

export default VacancyItem;
