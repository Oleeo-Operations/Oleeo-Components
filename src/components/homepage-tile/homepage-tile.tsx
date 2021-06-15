import React from 'react';
import { CategoryDetails } from '../../types/HomepageTileDetails';
import VacancyCount from '../vacancy-count/vacancy-count';

type HomepageTileProps = {
  details: CategoryDetails;
  vacancyCount: number;
  isLoading: boolean;
  directory: string;
  classname: string
};

/**
 * A component to display the contents of the tile (typically displayed on the homepage).
 * Includes an image and a count of the number of vacancies which match the category.
 * @param {HomepageTileProps} props
 * @return {*}  {JSX.Element}
 */
const HomepageTile = (props: HomepageTileProps): JSX.Element => {
  const { details, vacancyCount, isLoading, directory, classname } = props;
  return (
    <div
      className={classname === '1' ? 'homepage-tile' : 'homepage-tile-style-2'}
      style={{
        // Add a conditional style, add background image if it exists
        backgroundImage: details.imageSrc ? `url(${details.imageSrc})` : 'none',
      }}
    >
      <a href={`${directory || ''}${details.slug}`}>
        <div className="homepage-tile-inner">
          <h3
            className="homepage-tile-heading"
            // Need to use dangerouslySetInnerHTML because the text usually contains htmlEntities
            dangerouslySetInnerHTML={{ __html: details.name }}
          />
          {!isLoading && <VacancyCount count={vacancyCount} />}
        </div>
      </a>
    </div>
  );
};

export default HomepageTile;
