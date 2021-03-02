import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import Modal from './modal';

describe('COMPONENT: HomepageTile', (): void => {
  // Since this component doesn't do much, let's not go too wild with the tests

  let wrapper: ReactWrapper;

  let handleClose;

  beforeEach(() => {
    handleClose = jest.fn();

    // Mount the component
    // Using mount so we can access DOM properties
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

  it('should correctly set the title and description', () => {
    const descriptionDiv = wrapper.find('#modal-description');
    const titleDiv = wrapper.find('#modal-title');

    const dialog = wrapper.find('.modal');

    expect(descriptionDiv.text()).toEqual('Test Description');
    expect(titleDiv.text()).toEqual('Test Title');

    expect(dialog.prop('aria-labelledby')).toEqual('modal-title');
    expect(dialog.prop('aria-describedby')).toEqual('modal-description');
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
