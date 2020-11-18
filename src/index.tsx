import VacancyListing from './components/vacancy-listing';

declare var window: any;

/**
 * Store the components against window so they can be used by another script in the browser
 */
window.oleeo = {};

window.oleeo.VacancyListing = VacancyListing;
