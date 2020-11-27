import React, { useEffect, useState } from 'react';
import { map } from 'rxjs/operators';
import { Vacancy } from '../types/Vacancy';
import RSSService from '../services/rss-service';

type VacancyCountProps = {
  text?: string;
  feedURL: string;
  filter?: (vac: Vacancy) => boolean;
};

const VacancyCount = (props: VacancyCountProps): JSX.Element => {
  const { text, feedURL, filter } = props;
  const [vacancyCount, setVacancyCount] = useState<number>(null);

  useEffect(() => {
    const $subscription = RSSService.getFeed(feedURL)
      .pipe(
        map((vacancies) => {
          return vacancies.filter(filter).length;
        })
      )
      .subscribe({ next: (vacCount) => setVacancyCount(vacCount) });

    return (): void => $subscription.unsubscribe();
  }, []);

  return (
    <p>
      {vacancyCount}
      {text}
    </p>
  );
};

VacancyCount.defaultProps = {
  filter: (): boolean => true,
  text: 'vacancies available',
};

export default VacancyCount;
