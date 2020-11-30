import React, { useEffect, useState } from 'react';
import rssService from '../services/rss-service';
import { HomepageTileDetails } from '../types/HomepageTileDetails';
import { Vacancy } from '../types/Vacancy';
import HomepageTile from './homepage-tile';
import Loader from './loader/loader';

type HomepageTileProps = {
  tiles: HomepageTileDetails[];
  feedURL: string;
};

const HomepageTiles = (props: HomepageTileProps): JSX.Element => {
  const { tiles, feedURL } = props;
  const [vacancyCounts, setVacancyCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const $subscription = rssService.getFeed(feedURL).subscribe({
      next: (vacancies: Vacancy[]) => {
        const counts: { [key: string]: number } = {};
        vacancies.forEach((vacancy) => {
          if (counts[vacancy.content.directorate]) {
            counts[vacancy.content.directorate] += 1;
          } else {
            counts[vacancy.content.directorate] = 1;
          }
        });
        setVacancyCounts(counts);
        setIsLoading(false);
      },
    });
    return (): void => $subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

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
            key={tile.slug}
          />
        );
      })}
    </div>
  );
};

export default HomepageTiles;
