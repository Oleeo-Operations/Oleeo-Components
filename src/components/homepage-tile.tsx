import React from 'react';
import { HomepageTileDetails } from '../types/HomepageTileDetails';
import VacancyCount from './vacancy-count';

type HomepageTileProps = {
  details: HomepageTileDetails;
  vacancyCount: number;
};

const HomepageTile = (props: HomepageTileProps): JSX.Element => {
  const { details, vacancyCount } = props;
  return (
    <div
      className="homepage-tile"
      style={{ backgroundImage: `url(${details.imageSrc})` }}
    >
      <a href={`/roles/${details.slug}`}>
        <div className="homepage-tile-inner">
          <h3
            className="homepage-tile-heading"
            dangerouslySetInnerHTML={{ __html: details.name }}
          />
          <VacancyCount count={vacancyCount} />
        </div>
      </a>
    </div>
  );
};

export default HomepageTile;
