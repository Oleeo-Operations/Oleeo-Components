// Polyfills
import '@babel/polyfill';
import VacancyListing from './components/vacancy-listing';
import HomepageTiles from './components/homepage-tiles';
import Search from './components/search';

// The below is another polyfill for React
declare const Element: any;

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

declare let window: any; // To make typescript happy

/**
 * Store the components against window so they can be used by another script in the browser
 */
window.oleeo = { VacancyListing, HomepageTiles, Search };
