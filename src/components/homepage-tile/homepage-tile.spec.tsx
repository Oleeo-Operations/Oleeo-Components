/* eslint-disable import/no-extraneous-dependencies */
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import HomepageTile from './homepage-tile';
import jobCategories from '../../data/categories';

describe('COMPONENT: HomepageTile', (): void => {
  let wrapper: ReactWrapper;
  const directory = '/roles/';
  beforeEach(() => {
    wrapper = mount(
      <HomepageTile
        vacancyCount={2}
        details={jobCategories[0]}
        isLoading={false}
        directory={directory}
      />
    );
  });
  it('should be defined', () => {
    expect(wrapper).not.toBeUndefined();
  });
  it('should render the category name in a <h3>', () => {
    const expectedName = jobCategories[0].name;
    const h3Content = wrapper.find('h3').html();

    expect(h3Content).toContain(expectedName);
  });

  it('should link to the provided slug', () => {
    const link = wrapper.find('a');
    const expectedLink = `${directory}${jobCategories[0].slug}`;
    expect(link.props().href).toEqual(expectedLink);
  });
});
