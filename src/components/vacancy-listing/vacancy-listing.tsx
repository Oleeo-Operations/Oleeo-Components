import React, { MouseEvent, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import RssService from '../../services/rss-service';
import VacancyItem from '../vacancy-item/vacancy-item';
import Loader from '../loader/loader';
import VacancyDescriptionModal from '../vacancy-description-modal/vacancy-description-modal';
import { Vacancy } from '../../types/Vacancy';
import Modal from '../modal/modal';
import './vacancy-listing.scss';

type VacancyListingProps = {
  feedURL: string;
  numberOfItems: number;
  noVacanciesMessage?: string;
  noApplyBrandIDs?: number[];
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
  sort: (a: Vacancy, b: Vacancy) => number;
};

/**
 *
 * A component to display a configurable amount of vacancies in a listing.
 * TODO: Implement a configurable way to sort the listing
 * @param {VacancyListingProps} props
 * @return {*}  {JSX.Element}
 */
const VacancyListing = (props: VacancyListingProps): JSX.Element => {
  const [vacancies, setVacancies] = useState<Vacancy[]>(null);
  const [linkClicked, setLinkClicked] = useState<HTMLButtonElement>();
  const [activeVacancy, setActiveVacancy] = useState<Vacancy>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const {
    feedURL,
    numberOfItems,
    noVacanciesMessage,
    propertiesToDisplay,
    modalPropertiesToDisplay,
    noApplyBrandIDs,
    filter,
    sort,
  } = props;

  const handleVacancyClick = (
    $event: MouseEvent<HTMLButtonElement>,
    vacancy: Vacancy
  ): void => {
    setLinkClicked($event.target as HTMLButtonElement);
    setActiveVacancy(vacancy);
  };

  const closeModal = (): void => {
    setActiveVacancy(null);
    if (linkClicked) {
      linkClicked.focus();
    }
  };

  const handleModalClose = (): void => {
    closeModal();
  };

  useEffect(() => {
    // Subscribe to the rss feed

    const $subscription: Subscription = RssService.getFeed(feedURL).subscribe({
      next: (response) => {
        setHasLoaded(true);
        setVacancies(response);
      },
    });

    // Return a function to cleanup
    return (): void => $subscription.unsubscribe();
  }, [feedURL]);

  if (!hasLoaded) {
    return <Loader />;
  }

  if (
    !vacancies ||
    vacancies.length === 0 ||
    vacancies.filter(filter || ((): boolean => true)).length === 0
  ) {
    return <span className="no-vacancies">{noVacanciesMessage}</span>;
  }

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
          modalTitle="Vacancy Details"
          modalDescription="View the vacancy details. Click Apply to make an application."
        >
          {activeVacancy && (
            <VacancyDescriptionModal
              vacancy={activeVacancy}
              noApplyBrandIDs={noApplyBrandIDs}
              propertiesToDisplay={modalPropertiesToDisplay}
            />
          )}
        </Modal>
      </div>
    </>
  );
};

VacancyListing.defaultProps = {
  noVacanciesMessage: 'No vacancies',
  noApplyBrandIDs: [],
};

export default VacancyListing;
