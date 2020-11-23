import FocusTrap from 'focus-trap-react';
import React, { useEffect } from 'react';
import { fromEvent } from 'rxjs';

type ModalProps = {
  children: JSX.Element;
  modalTitle: string;
  modalDescription: string;
  width: string;
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
  const {
    children,
    handleClose,
    modalTitle,
    modalDescription,
    isOpen,
    width,
  } = props;
  let closeButton: HTMLButtonElement;
  useEffect(() => {
    if (isOpen) {
      closeButton.focus();
    }
    // For accessibility reasons, we need to close the Modal when the enter key is pressed.
    const $subscription = fromEvent(document, 'keyUp').subscribe(
      ($event: KeyboardEvent) => {
        if ($event.key === 'Escape') {
          handleClose();
        }
      }
    );
    // Return a cleanup function which unsubscribes
    return (): void => $subscription.unsubscribe();
  }, []);

  return (
    <>
      <div
        className="modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.4)',
          display: isOpen ? 'block' : 'none',
        }}
      />
      <dialog
        aria-modal
        open={isOpen}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: 999,
          border: 'none',
          boxShadow: '0 8px 20px 0 rgba(0,0,0,0.125)',
          borderRadius: '4px',
          width,
        }}
      >
        {isOpen && (
          <FocusTrap>
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
                    <span className="icon" aria-hidden="true">
                      &#x274C;
                    </span>
                    <span className="sr-only">Close Dialog</span>
                  </button>
                </div>
              </div>
              <div className="modal-body">{children}</div>
            </div>
          </FocusTrap>
        )}
      </dialog>
    </>
  );
};

export default Modal;
