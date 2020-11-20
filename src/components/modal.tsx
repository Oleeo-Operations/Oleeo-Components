import React from 'react';

type ModalProps = {
  children: JSX.Element;
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
  const { children, handleClose, isOpen, width } = props;
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
      <dialog
        open={isOpen}
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
