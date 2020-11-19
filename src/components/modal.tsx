import React from 'react';

type ModalProps = {
  children: JSX.Element;
  isOpen: boolean;
  handleClose: () => void;
};

const Modal = (props: ModalProps): JSX.Element => {
  const { children, handleClose, isOpen } = props;
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
        }}
      />
      <dialog open={isOpen}>
        <div className="modal-header">
          <button type="button" onClick={handleClose}>
            Close
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </dialog>
    </>
  );
};

export default Modal;
