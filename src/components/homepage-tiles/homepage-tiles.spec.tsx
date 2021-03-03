import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { Observable, of } from 'rxjs';
import HomepageTiles from './homepage-tiles';
import categories from '../../data/categories';
import vacancies from '../../data/vacancies';
import HomepageTile from '../homepage-tile/homepage-tile';
import rssService from '../../services/rss-service';

describe('COMPONENT: HomepageTiles', () => {
  let wrapper: ReactWrapper;

  const countField = 'directorate';

  const spy = jest
    .spyOn(rssService, 'getFeed')
    .mockImplementation((feedURL: string) => of(vacancies));

  beforeEach(() => {
    wrapper = mount(
      <HomepageTiles
        tiles={categories}
        feedURL=""
        countField={countField}
        directory="/roles/"
      />
    );
  });
  it('should be defined', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render an instance of HomepageTile for each category provided', () => {
    const expectedLength = categories.length;
    expect(wrapper.find(HomepageTile).length).toEqual(expectedLength);
  });

  it('should render a simple p tag if no categories are supplied as props', () => {
    wrapper.setProps({ tiles: null });
    wrapper.update();

    expect(wrapper.find('p.error').length).toEqual(1);
    expect(wrapper.find('p.error').text()).toEqual(
      'No tiles supplied to HomepageTile component'
    );
  });

  it('should correctly calculate the vacancyCounts', () => {
    // TODO: Implement this test
    const vacancyCounts = {};
    vacancies.forEach((vac) => {
      if (vacancyCounts[vac.content[countField]]) {
        vacancyCounts[vac.content[countField]] += 1;
      } else {
        vacancyCounts[vac.content[countField]] = 1;
      }
    });
    wrapper.find(HomepageTile).forEach((tile) => {
      // For each tile, expect that to provided prop is equal to the expected count
      expect(tile.prop('vacancyCount')).toEqual(
        vacancyCounts[tile.prop('details').name]
      );
    });
  });

  it('should call RSSService->getFeed', () => {
    expect(spy).toHaveBeenCalled();
  });
});
