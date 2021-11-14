import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const ErrorBar = () => {
  const { state } = useContext(AppContext);
  const { layout } = state;

  return (
    layout.maintenance
      ? <div className="error-bar">
          Cloud is currently in maintenance mode, some features might not be available at the moment, please try later.
        </div>
      : <></>
  )
};

export default ErrorBar;
