import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMountEffect } from '../helpers/hooks';

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
  const navigate = useNavigate();
  const { state } = useContext(AppContext);
  const { layout } = state;

  useMountEffect(() => {
    if (!Auth.loggedIn()) navigate('/login', { from: location });
  });

  return (
    location.pathname.match(/\/(pay|payment)\/?$/)
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
