import React from 'react';
import './loader.scss';

const Loader = (): JSX.Element => {
  return (
    <div className="loader">
      <div className="lds-dual-ring" />
    </div>
  );
};

export default Loader;
