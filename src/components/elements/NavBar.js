import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaAddressBook,
  FaBitcoin,
  FaCog,
  FaDiscord,
  FaGlobe,
  FaHashtag,
  FaHome,
  FaIdCard,
  FaLink,
  FaMedium,
  FaReceipt,
  FaRedditAlien,
  FaSignOutAlt,
  FaTelegramPlane,
  FaTwitter
} from 'react-icons/fa';
import { AiOutlineBank } from 'react-icons/ai';

import { AppContext } from '../ContextProvider';


const NavBar = () => {
  const { actions, state } = useContext(AppContext);
  const { logoutUser } = actions;
  const { appSettings } = state;

  return (
    <div className="slim-navbar">
      <div className="container">

        <ul className="nav">
          <li className="nav-item nav-item-small">
            <NavLink exact to="/dashboard" className="nav-link hot_link" activeClassName="active">
              <FaHome />
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/deposits" className="nav-link hot_link" activeClassName="active">
              <AiOutlineBank /> <span>Deposits</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/id" className="nav-link hot_link" activeClassName="active">
              <FaIdCard /> <span>Id</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/pay_settings" className="nav-link hot_link" activeClassName="active">
              <FaReceipt /> <span>Pay</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/address_book" className="nav-link hot_link" activeClassName="active">
              <FaAddressBook /> <span>Contacts</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/settings" className="nav-link hot_link" activeClassName="active">
              <FaCog /> <span>Settings</span>
            </NavLink>
          </li>
          <li className="nav-item with-sub nav-item-small">
            <button className="nav-link hot_link" data-toggle="dropdown">
              <FaGlobe />
            </button>
            <div className="sub-item sub-item-right">
              <ul>
                <li>
                  <a href={appSettings.homePage} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaHome /> <span>Website</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.explorerURL} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaLink /> <span>Explorer</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.poolURL} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaHashtag /> <span>Mining Pool</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.coinGecko} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaBitcoin /> <span>CoinGecko</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.coinMarketCap} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaBitcoin /> <span>CoinMarketCap</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.discord} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaDiscord /> <span>Discord</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.telegram} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaTelegramPlane /> <span>Telegram</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.twitter} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaTwitter /> <span>Twitter</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.reddit} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaRedditAlien /> <span>Reddit</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.medium} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FaMedium /> <span>Medium</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li className="nav-item nav-item-small">
            <button className="nav-link hot_link" onClick={logoutUser}>
              <FaSignOutAlt />
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
};

export default NavBar;
