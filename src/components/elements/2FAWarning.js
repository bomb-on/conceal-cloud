import React, { useContext } from 'react';

import { AppContext } from '../ContextProvider';


const TwoFAWarning = () => {
  const { state } = useContext(AppContext);
  const { userSettings, layout } = state;

  return (
    layout.userLoaded && !userSettings.twoFAEnabled
      ? <div className="twofa-warning">
          Your Two-Factor Authentication is not enabled. For max security, enable it in settings!
        </div>
      : <></>
  )
};

export default TwoFAWarning;
