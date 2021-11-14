import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AppContext } from './ContextProvider';
import AuthHelper from '../helpers/AuthHelper';
import ErrorBar from './elements/ErrorBar';
import Header from './elements/Header';
import NavBar from './elements/NavBar';
import Footer from './elements/Footer';
import TwoFAWarning from './elements/2FAWarning';


const Auth = new AuthHelper();

const PrivateRoute = props => {
  const location = useLocation();
  const { state } = useContext(AppContext);
  const { layout } = state;

  return (
    !Auth.loggedIn()
      ? <Navigate to="/login" state={{ from: location }} />
      : location.pathname.match(/\/(pay|payment)\/?$/)
        ? props.children
        : <>
            <ErrorBar />
            <div style={{ paddingTop: layout.maintenance ? 46 : 0 }} >
              <TwoFAWarning />
              <Header />
              <NavBar />
              {props.children}
              <Footer />
            </div>
          </>
  );
};

export default PrivateRoute;
