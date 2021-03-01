import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import Modal from './modal';

describe('COMPONENT: HomepageTile', (): void => {
  // Since this component doesn't do much, let's not go too wild with the tests

  let wrapper: ReactWrapper;

  let handleClose;

  beforeEach(() => {
    handleClose = jest.fn();

    wrapper = mount(
      <Modal
        modalDescription="Test Description"
        modalTitle="Test Title"
        handleClose={handleClose}
        isOpen
      >
        <h1>Modal Content</h1>
      </Modal>
    );
  });

  it('should be defined', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('should call the handleClose prop when the close button is clicked', () => {
    const closeButton = wrapper.find('.modal-close');

    closeButton.simulate('click');

    expect(handleClose).toHaveBeenCalled();
  });

  it('should call the handleClose prop when the Escape key is pressed', () => {
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    expect(handleClose).toHaveBeenCalled();
  });
});
