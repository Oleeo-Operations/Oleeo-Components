import VacancyListing from './components/vacancy-listing';
import VacancyCount from './components/vacancy-count';
import './styles.scss';

declare let window: any;

/**
 * Store the components against window so they can be used by another script in the browser
 */
window.oleeo = { VacancyListing, VacancyCount };
