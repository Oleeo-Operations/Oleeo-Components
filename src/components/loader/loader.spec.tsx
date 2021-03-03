import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import Loader from './loader';

describe('COMPONENT: HomepageTile', (): void => {
  // Since this component doesn't do much, let's not go too wild with the tests

  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<Loader />);
  });

  it('should be defined', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('should contain a screen-reader only element which says "Loading vacancies"', () => {
    const el = wrapper.find('.sr-only');
    expect(el).toBeDefined();
    expect(el.text()).toEqual('Loading vacancies');
  });
});
