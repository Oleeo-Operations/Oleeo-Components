import React from 'react';

type VacancyCountProps = {
  count: number;
};

const VacancyCount = (props: VacancyCountProps): JSX.Element => {
  const { count } = props;

  if (!count) {
    return (
      <p className="vacancy-count no-vacancies-available">
        No current vacancies
      </p>
    );
  }

  return (
    <p className="vacancy-count">
      {count} {count === 1 ? 'vacancy' : 'vacancies'} available
    </p>
  );
};

export default VacancyCount;
