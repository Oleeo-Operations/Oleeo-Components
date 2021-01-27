import 'core-js/es/map';
import 'core-js/es/set';
import VacancyListing from './components/vacancy-listing';
import HomepageTiles from './components/homepage-tiles';
import Search from './components/search';

declare let window: any;

/**
 * Store the components against window so they can be used by another script in the browser
 */
window.oleeo = { VacancyListing, HomepageTiles, Search };
