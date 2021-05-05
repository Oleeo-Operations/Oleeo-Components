import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import VacancyCount from './vacancy-count';

describe('COMPONENT: VacancyCount', () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<VacancyCount count={1} />);
  });

  it('should display "No vacancies available" when the count is zero', () => {
    wrapper.setProps({ count: 0 });
    wrapper.update();

    const hostEl = wrapper.find('.vacancy-count');

    expect(hostEl.text()).toEqual('No vacancies available');
  });

  it('should display the number of vacancies available when not zero', () => {
    // Let's use some random numbers to test
    const randomArray = [...Array(50)].map(() =>
      Math.ceil(Math.random() * 100)
    );

    randomArray.forEach((num) => {
      wrapper.setProps({ count: num });
      wrapper.update();
      const hostEl = wrapper.find('.vacancy-count');
      expect(hostEl.text()).toEqual(
        `${num} ${num === 1 ? 'vacancy' : 'vacancies'} available`
      );
    });
  });
});
