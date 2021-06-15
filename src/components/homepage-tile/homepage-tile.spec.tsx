/* eslint-disable import/no-extraneous-dependencies */
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import HomepageTile from './homepage-tile';
import jobCategories from '../../data/categories';
import VacancyCount from '../vacancy-count/vacancy-count';

describe('COMPONENT: HomepageTile', (): void => {
  let wrapper: ShallowWrapper;
  const directory = '/roles/';
  beforeEach(() => {
    wrapper = shallow(
      <HomepageTile
        vacancyCount={2}
        details={jobCategories[0]} // Just use the first one for testing
        isLoading={false}
        directory={directory}
        classname=''
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

  it('should display the VacancyCount component when the component is not in the loading state', () => {
    wrapper.setProps({ isLoading: true });
    expect(wrapper.find(VacancyCount).length).toEqual(0);

    wrapper.setProps({ isLoading: false });
    expect(wrapper.find(VacancyCount).length).toEqual(1);
  });
});
