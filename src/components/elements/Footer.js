import React, { useContext } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';


const Footer = () => {
  const { state } = useContext(AppContext);
  const { appSettings, layout } = state;

  return (
    <div className="slim-footer">
      <div className="container">
        <p>
          Copyright 2019 &copy; All Rights Reserved. Conceal Network | <Link to="/terms">Terms &amp; Conditions</Link>
        </p>
        <p>
          Version:&nbsp;
          <OverlayTrigger overlay={<Tooltip id={appSettings.appShortSha}>{appSettings.appShortSha}</Tooltip>}>
            <a href="https://github.com/ConcealNetwork/conceal-cloud/blob/master/CHANGES.md" target="_blank" rel="noopener noreferrer">
              {appSettings.appVersion}
            </a>
          </OverlayTrigger>
          &nbsp;|&nbsp;
          Last Update: {layout.lastUpdate.toUTCString()}
        </p>
      </div>
    </div>
  )
};

export default Footer;
