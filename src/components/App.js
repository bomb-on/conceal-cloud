import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'

import AppContextProvider from './ContextProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/Dashboard';
import AddressBook from './pages/AddressBook';
import Settings from './pages/Settings';
import GettingStarted from './pages/GettingStarted';
import UpcomingFeatures from './pages/UpcomingFeatures';
import Donate from './pages/Donate';
import Pay from './pages/Pay';
import PaySettings from './pages/PaySettings';
import Id from './pages/Id';
import Deposits from './pages/Deposits';
import Policy from './pages/Policy';

import 'react-notifications-component/dist/theme.css';
import '../static/css/slim.css';
import '../static/css/slim.one.css';
import '../static/css/font-awesome-animation.min.css';


const App = () => (
  <Router>
    <AppContextProvider>
      <ReactNotification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy_policy" element={<Policy />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/banking" element={<PrivateRoute><Deposits /></PrivateRoute>} />
        <Route path="/deposits" element={<PrivateRoute><Deposits /></PrivateRoute>} />
        <Route path="/id" element={<PrivateRoute><Id /></PrivateRoute>} />
        <Route path="/address_book" element={<PrivateRoute><AddressBook /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/pay_settings" element={<PrivateRoute><PaySettings /></PrivateRoute>} />
        <Route path="/getting_started" element={<PrivateRoute><GettingStarted /></PrivateRoute>} />
        <Route path="/upcoming_features" element={<PrivateRoute><UpcomingFeatures /></PrivateRoute>} />
        <Route path="/payment/" element={<PrivateRoute><Donate /></PrivateRoute>} />
        <Route path="/pay/" element={<PrivateRoute><Pay /></PrivateRoute>} />
      </Routes>
    </AppContextProvider>
  </Router>
);

export default App;
