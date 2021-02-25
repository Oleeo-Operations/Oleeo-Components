/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import FocusTrap from 'focus-trap-react';
import React, { useEffect } from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
                    <FontAwesomeIcon icon={faTimes} />
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
