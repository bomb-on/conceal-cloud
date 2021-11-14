import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AppContext } from './ContextProvider';
import AuthHelper from '../helpers/AuthHelper';
import ErrorBar from './elements/ErrorBar';
import Header from './elements/Header';
import NavBar from './elements/NavBar';
import Footer from './elements/Footer';
import TwoFAWarning from './elements/2FAWarning';


const Auth = new AuthHelper();

const PrivateRoute = props => {
  const { component: Component, ...rest } = props;
  const { state } = useContext(AppContext);
  const { layout } = state;

  return (
    <Route
      {...rest}
      render={props =>
        Auth.loggedIn()
          ? <>
              {(props.location.pathname.startsWith('/payment/') || props.location.pathname.startsWith('/pay/'))
                ? <Component {...props} />
                : <>
                    <ErrorBar />
                    <div style={{ paddingTop: layout.maintenance ? 46 : 0 }} >
                      <TwoFAWarning />
                      <Header />
                      <NavBar />
                      <Component {...props} />
                      <Footer />
                    </div>
                  </>
              }
            </>
          : <Redirect to={{ pathname: '/' }}/>
      }
    />
  );
};

export default PrivateRoute;
