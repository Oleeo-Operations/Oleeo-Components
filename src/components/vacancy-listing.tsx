import React, { useEffect, useState } from 'react';
import RssService from '../services/rss-service';
import { Subscription } from 'rxjs';
import VacancyItem from './vacancy-item';
import { Vacancy } from '../types/Vacancy';

type VacancyListingProps = {
  feedURL: string;
  numberOfItems: number;
  propertiesToDisplay: [
    {
      key: string;
      label: string;
      isArray: boolean;
    }
  ];
  filter?: (item: Vacancy) => boolean;
};

/**
 *
 * A component to display a configurable amount of vacancies in a listing.
 *
 * @param {VacancyListingProps} props
 * @return {*}  {JSX.Element}
 */
const VacancyListing = (props: VacancyListingProps): JSX.Element => {
  const [vacancies, setVacancies] = useState<Vacancy[]>(null);
  const { feedURL, numberOfItems, propertiesToDisplay, filter } = props;

  useEffect(() => {
    let $subscription: Subscription;

    // Subscribe to the rss feed
    $subscription = RssService.getFeed(feedURL).subscribe({
      next: (response) => {
        setVacancies(response);
      },
    });

    // Return a function to cleanup
    return (): void => $subscription.unsubscribe();
  }, [feedURL]);

  return (
    <div className="vacancy-listing">
      {vacancies &&
        vacancies
          .filter(filter || (() => true))
          .slice(0, numberOfItems)
          .map((vac: Vacancy) => (
            <VacancyItem
              vacancy={vac}
              propertiesToDisplay={propertiesToDisplay}
              key={vac.id}
            />
          ))}
    </div>
  );
};

export default VacancyListing;
