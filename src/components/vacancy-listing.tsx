import React, { MouseEvent, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import RssService from '../services/rss-service';
import VacancyItem from './vacancy-item';
import VacancyDescriptionModal from './vacancy-description-modal';
import { Vacancy } from '../types/Vacancy';
import Modal from './modal';

type VacancyListingProps = {
  feedURL: string;
  numberOfItems: number;
  propertiesToDisplay: [
    {
      key: string;
      label: string;
      isArray: boolean;
      isHTML: boolean;
    }
  ];
  modalPropertiesToDisplay: [
    {
      key: string;
      label: string;
      isArray: boolean;
      isHTML: boolean;
    }
  ];
  filter: (item: Vacancy) => boolean;
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
  const [linkClicked, setLinkClicked] = useState<HTMLButtonElement>();
  const [activeVacancy, setActiveVacancy] = useState<Vacancy>(null);
  const {
    feedURL,
    numberOfItems,
    propertiesToDisplay,
    modalPropertiesToDisplay,
    filter,
  } = props;

  const handleVacancyClick = (
    $event: MouseEvent<HTMLButtonElement>,
    vacancy: Vacancy
  ): void => {
    setLinkClicked($event.target as HTMLButtonElement);
    setActiveVacancy(vacancy);
  };

  const handleModalClose = (): void => {
    linkClicked.focus();
    setActiveVacancy(null);
  };

  useEffect(() => {
    // Subscribe to the rss feed

    const $subscription: Subscription = RssService.getFeed(feedURL).subscribe({
      next: (response) => {
        setVacancies(response);
      },
    });

    // Return a function to cleanup
    return (): void => $subscription.unsubscribe();
  }, [feedURL]);

  return (
    <>
      <div className="vacancy-listing">
        {vacancies &&
          vacancies
            .filter(filter || ((): boolean => true))
            .slice(0, numberOfItems)
            .map((vac: Vacancy) => (
              <VacancyItem
                vacancy={vac}
                propertiesToDisplay={propertiesToDisplay}
                key={vac.id}
                handleVacancyClick={handleVacancyClick}
              />
            ))}
      </div>

      <div>
        <Modal
          handleClose={handleModalClose}
          isOpen={!!activeVacancy}
          width="75%"
        >
          {activeVacancy && (
            <VacancyDescriptionModal
              vacancy={activeVacancy}
              propertiesToDisplay={modalPropertiesToDisplay}
            />
          )}
        </Modal>
      </div>
    </>
  );
};

export default VacancyListing;
