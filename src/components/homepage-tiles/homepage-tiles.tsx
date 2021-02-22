import React, { useEffect, useState } from 'react';
import rssService from '../../services/rss-service';
import { CategoryDetails } from '../../types/HomepageTileDetails';
import { Vacancy } from '../../types/Vacancy';
import HomepageTile from '../homepage-tile/homepage-tile';
import './homepage-tiles.scss';

type HomepageTileProps = {
  tiles: CategoryDetails[];
  feedURL: string;
  countField: string;
};

/**
 * Component to display the tiles. Requires input of the FeedURL and tile details.
 * @param {HomepageTileProps} props
 * @return {*}  {JSX.Element}
 */
const HomepageTiles = (props: HomepageTileProps): JSX.Element => {
  const { tiles, feedURL, countField } = props;

  const [vacancyCounts, setVacancyCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to the RSS feed to get the data
    // TODO: Add in some error handling
    const $subscription = rssService.getFeed(feedURL).subscribe({
      next: (vacancies: Vacancy[]) => {
        const counts: { [key: string]: number } = {};
        vacancies.forEach((vacancy) => {
          // For each vacancy, increment the appropriate category count
          // * This can probably be improved to use Array.reduce()?
          if (counts[vacancy.content[countField]]) {
            counts[vacancy.content[countField]] += 1;
          } else {
            counts[vacancy.content[countField]] = 1;
          }
        });
        setVacancyCounts(counts);
        setIsLoading(false);
      },
    });

    // Return a function to clean up
    return (): void => $subscription.unsubscribe();
  }, []);

  if (!tiles) {
    console.warn('No tiles supplied to HomepageTile component');
    return null;
  }

  return (
    <div className="homepage-tiles">
      {tiles.map((tile) => {
        return (
          <HomepageTile
            details={tile}
            vacancyCount={vacancyCounts[tile.name]}
            isLoading={isLoading}
            key={tile.slug}
          />
        );
      })}
    </div>
  );
};

export default HomepageTiles;
