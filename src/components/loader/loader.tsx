import React from 'react';

const Loader = (): JSX.Element => {
  return (
    <div
      className="loader"
      style={{ width: '100%', textAlign: 'center', margin: '3rem 0' }}
    >
      <div className="lds-dual-ring" />
      <span className="sr-only">Loading vacancies</span>
    </div>
  );
};

export default Loader;
