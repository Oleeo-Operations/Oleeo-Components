/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import FocusTrap from 'focus-trap-react';
import React, { useEffect } from 'react';
import { fromEvent, Subscription } from 'rxjs';
import './modal.scss';

type ModalProps = {
  children: JSX.Element;
  modalTitle: string;
  modalDescription: string;
  isOpen: boolean;
  handleClose: () => void;
};

/**
 *
 * A component which displays content in a modal window
 * @param {ModalProps} props
 * @return {*}  {JSX.Element}
 */
const Modal = (props: ModalProps): JSX.Element => {
  const { children, handleClose, modalTitle, modalDescription, isOpen } = props;

  let $subscription: Subscription;

  let closeButton: HTMLButtonElement;

  useEffect(() => {
    if (isOpen) {
      // Focus the first button (the close button) when the modal window opens
      closeButton.focus();
    }
    // Accessibility is important! We need to close the Modal when the escape key is pressed.
    $subscription = fromEvent(document, 'keyup').subscribe(
      ($event: KeyboardEvent) => {
        if ($event.key === 'Escape') {
          // If the ESC key was pressed, we close the modal
          handleClose();
        }
      }
    );
    // Return a cleanup function which unsubscribes
    return (): void => {
      if ($subscription) {
        $subscription.unsubscribe();
      }
    };
  }, []);

  return (
    isOpen && (
      <>
        <div
          className="modal-overlay"
          onClick={(): void => {
            handleClose();
          }}
        />
        <dialog
          aria-modal
          open={isOpen}
          className="modal"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
            <div className="modal-contents">
              <div className="sr-only" id="modal-title">
                {modalTitle}
              </div>
              <div className="sr-only" id="modal-description">
                {modalDescription}
              </div>
              <div className="modal-header" style={{ display: 'flex' }}>
                <div
                  className="button-container"
                  style={{ marginLeft: 'auto' }}
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    className="modal-close btn btn-round"
                    ref={(el): void => {
                      closeButton = el;
                    }}
                  >
                    {/* Add a cross icon. People should know that means close. */}
                    <svg
                      height="25px"
                      id="Layer_1"
                      version="1.1"
                      viewBox="0 0 512 512"
                      width="25px"
                    >
                      <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
                    </svg>
                    <span className="sr-only">Close Dialog</span>
                  </button>
                </div>
              </div>
              <div className="modal-body">{children}</div>
            </div>
          </FocusTrap>
        </dialog>
      </>
    )
  );
};

export default Modal;
