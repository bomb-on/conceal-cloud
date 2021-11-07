import React, { useContext, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaCloudDownloadAlt,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaMedium,
  FaSignInAlt,
  FaTelegram,
  FaTimes,
  FaTwitter,
  FaUserPlus,
} from 'react-icons/fa';
import AOS from 'aos';

import { AppContext } from '../ContextProvider';
import { useAddToHomescreenPrompt } from "../../helpers/HomeScreen";

import landingImg1 from '../../static/img/landing_img1.jpg';
import landingImg2 from '../../static/img/landing_img2.jpg';
import landingImg3 from '../../static/img/landing_img3.jpg';
import landingImg4 from '../../static/img/landing_img4.jpg';
import landingImg5 from '../../static/img/landing_img5.jpg';
import landingImg6 from '../../static/img/landing_img6.jpg';

const Home = () => {
  const location = useLocation();
  const [getIsVisible, promptToInstall] = useAddToHomescreenPrompt();
  const { state } = useContext(AppContext);
  const { layout, user } = state;
  const { redirectToReferrer } = layout;

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true,
    });

    const script=document.createElement('script');
    script.src='https://code.jquery.com/jquery-3.2.1.slim.min.js';
    document.body.appendChild(script);

    const jQuery=document.createElement('script');
    jQuery.src='https://conceal.network/landing/js/main.js';
    document.body.appendChild(jQuery);

    const landingCSS=document.createElement('link');
    landingCSS.href='https://conceal.network/landing/css/cloud-landing.css';
    landingCSS.rel='stylesheet';
    landingCSS.type='text/css';
    document.getElementsByTagName('head')[0].appendChild(landingCSS);

    const AOSCSS=document.createElement('link');
    AOSCSS.href='https://conceal.network/landing/css/aos.css';
    AOSCSS.rel='stylesheet';
    AOSCSS.type='text/css';
    document.getElementsByTagName('head')[0].appendChild(AOSCSS);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(jQuery);
      document.getElementsByTagName('head')[0].removeChild(landingCSS);
      document.getElementsByTagName('head')[0].removeChild(AOSCSS);
    }

  }, []);

  // create a scroll element to which we scroll
  const scrollElement = React.createRef();

  /*const onScrollToContent = () =>
    scrollElement.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  const onHomeScreenClick = (e) => {
    try {
      promptToInstall();
    } finally {
      e && e.preventDefault()
    }
  }*/

  if (redirectToReferrer && location.state && user.loggedIn()) {
    const { from } = location.state;
    return <Navigate to={from} />;
  }

  if (user.loggedIn()) return <Navigate to="/dashboard" />;

  return (
    <div className="landing-site-wrap">

      <div className="site-mobile-menu">
        <div className="site-mobile-menu-header">
          <div className="site-mobile-menu-close mt-3">
            <span className="js-menu-toggle"><FaTimes /></span>
          </div>
        </div>
        <div className="site-mobile-menu-body" />
      </div>

      <header className="site-navbar py-3" role="banner" id="siteHeader">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-2" id="logoDiv">
              <a href="../"></a>
            </div>
            <div className="col-12 col-md-8 d-none d-xl-block">
              <nav className="site-navigation position-relative text-right" role="navigation">
                <ul className="site-menu js-clone-nav mx-auto d-none d-lg-block">
                <li><a href="https://conceal.network/banking/">BANKING</a></li>
                <li className="active"><a href="https://conceal.cloud">CLOUD</a></li>
                <li><a href="https://conceal.network/id/">ID</a></li>
                <li><a href="https://conceal.network/labs/">LABS</a></li>
                <li><a href="https://conceal.network/messaging/">MESSAGING</a></li>
                <li><a href="https://conceal.network/mobile">MOBILE</a></li>
                <li><a href="https://conceal.network/pay/">PAY</a></li>
                  <li className="cta"><Link to="/login"><FaSignInAlt /> SIGN IN</Link></li>
                </ul>
              </nav>
            </div>
            <div className="d-inline-block d-xl-none ml-md-0 mr-auto py-3">
            <a href="#" className="site-menu-toggle js-menu-toggle text-white"><FaBars /></a>
          </div>
          </div>
        </div>
      </header>

      <div className="site-section site-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-10">
              <span className="d-block mb-3 caption" data-aos="fade-up" data-aos-delay="100">WELCOME TO CONCEAL CLOUD</span>
              <h1 className="d-block mb-4" data-aos="fade-up" data-aos-delay="200"><strong>Powerful</strong> web-based wallet &amp; dashboard</h1>
              <Link to="/signup" className="btn-custom btnSignMain" data-aos="fade-up"><span><FaUserPlus />&nbsp; SIGN UP</span></Link>
              <Link to="/login" className="btn-custom btnSignMain" data-aos="fade-up"><span><FaSignInAlt />&nbsp; SIGN IN</span></Link>
              {getIsVisible() && (
                <button className="btn-custom btnSignMain btnAddToHomepage" data-aos="fade-up" onClick={() => promptToInstall()}><span><FaCloudDownloadAlt />&nbsp; Install</span></button>
              )}
            </div>
          </div>
          <div className="downArrowWrapper">
            <a href="#downArrowBtn" className="downArrow" id="downArrowBtn"></a>
          </div>
        </div>
      </div>

      <div className="site-section" id="mainSection" ref={scrollElement}>
        <div className="container">
          <div className="row mb-12 aboutSection">
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="site-section-heading">
                <h2>About</h2>
              </div>
            </div>
            <div className="col-lg-8 mt-5 pl-lg-5" id="aboutDesc" data-aos="fade-up" data-aos-delay="200">
              <p>We aim to make the Conceal crypto-currency as easy to use as possible. With Conceal Cloud you have a wallet
                that is secure, fast, and easy to use. All you need to get started is an account.</p>
            </div>
          </div>

          <div className="row align-items-center speaker">
            <div className="col-lg-6 mb-5 mb-lg-0 imageWrapper_rounded" data-aos="fade" data-aos-delay="100">
              <img src={landingImg1} alt="Multiple Wallets" className="img-fluid rounded" />
            </div>
            <div className="col-lg-6 ml-auto">

              <div className="bio pl-lg-5">
                <h2 className="text-uppercase text-primary d-block mb-3" data-aos="fade-right" data-aos-delay="300">Multiple
                  Wallets</h2>
                <p className="mb-4" data-aos="fade-right" data-aos-delay="400">You can have multiple wallets on a single account. Each wallet has its own address so you can use them for different purposes. Up to 3 wallets per user are allowed.</p>

              </div>
            </div>
          </div>

          <div className="row align-items-center speaker">
            <div className="col-lg-6 mb-5 mb-lg-0 order-lg-2 imageWrapper_rounded" data-aos="fade" data-aos-delay="100">
              <img src={landingImg2} alt="Encrypted Messages" className="img-fluid rounded" />
            </div>
            <div className="col-lg-6 ml-auto order-lg-1">
              <div className="bio pr-lg-5">
                <h2 className="text-uppercase text-primary d-block mb-3" data-aos="fade-left" data-aos-delay="300">Encrypted
                  Messages</h2>
                <p className="mb-4" data-aos="fade-left" data-aos-delay="400">Try sending encrypted messages over the chain to the target user. The messages work in the cloud, desktop and mobile wallets. Nobody but you and the recipient can see what is being sent.</p>

              </div>
            </div>
          </div>

          <div className="row align-items-center speaker">
            <div className="col-lg-6 mb-5 mb-lg-0 imageWrapper_rounded" data-aos="fade" data-aos-delay="100">
              <img src={landingImg3} alt="Accept Payments" className="img-fluid rounded" />
            </div>
            <div className="col-lg-6 ml-auto">
              <div className="bio pl-lg-5">
                <h2 className="text-uppercase text-primary d-block mb-3" data-aos="fade-right" data-aos-delay="300">Accept
                  Payments</h2>
                <p className="mb-4" data-aos="fade-right" data-aos-delay="400">Accept payments from anywhere. You can also set up your own payment solution with Conceal Pay. This can be used in multiple scenarios like donations, web shops...</p>
              </div>
            </div>
          </div>


          <div className="row align-items-center speaker">
            <div className="col-lg-6 mb-5 mb-lg-0 order-lg-2 imageWrapper_rounded" data-aos="fade" data-aos-delay="100">
              <img src={landingImg4} alt="Address Book" className="img-fluid rounded" />
            </div>
            <div className="col-lg-6 ml-auto order-lg-1">
              <div className="bio pr-lg-5">
                <h2 className="text-uppercase text-primary d-block mb-3" data-aos="fade-left" data-aos-delay="300">Address Book
                </h2>
                <p className="mb-4" data-aos="fade-left" data-aos-delay="400">No need to copy / paste addresses every time. Maintain your address book for easy sending and receiving of funds.</p>
              </div>
            </div>
          </div>

          <div className="row align-items-center speaker">
            <div className="col-lg-6 mb-5 mb-lg-0 imageWrapper_rounded" data-aos="fade" data-aos-delay="100">
              <img src={landingImg1} alt="Maintain Aliases" className="img-fluid rounded" />
            </div>
            <div className="col-lg-6 ml-auto">
              <div className="bio pl-lg-5">
                <h2 className="text-uppercase text-primary d-block mb-3" data-aos="fade-right" data-aos-delay="300">Maintain
                  Aliases</h2>
                <p className="mb-4" data-aos="fade-right" data-aos-delay="400">You can create aliases for your wallet addresses, so your friends and partners can use easy to memorize aliases instead of long addresses.</p>
              </div>
            </div>
          </div>

          <div className="row align-items-center speaker">
            <div className="col-lg-6 mb-5 mb-lg-0 order-lg-2 imageWrapper_rounded" data-aos="fade" data-aos-delay="100">
              <img src={landingImg6} alt="Export Private Keys" className="img-fluid rounded" />
            </div>
            <div className="col-lg-6 ml-auto order-lg-1">
              <div className="bio pr-lg-5">
                <h2 className="text-uppercase text-primary d-block mb-3" data-aos="fade-left" data-aos-delay="300">Export
                  Private Keys</h2>
                <p className="mb-4" data-aos="fade-left" data-aos-delay="400">Your keys your money. You can export your private keys anytime and import them for instance to Desktop Wallet. This means you are in control of your funds. Even if the cloud would not be working you still always have access to your funds.</p>
              </div>
            </div>
          </div>

          <div className="row align-items-center speaker">
            <div className="col-lg-6 mb-5 mb-lg-0 imageWrapper_rounded" data-aos="fade" data-aos-delay="100">
              <img src={landingImg5} alt="2-Factor Authentication" className="img-fluid rounded" />
            </div>
            <div className="col-lg-6 ml-auto">
              <div className="bio pl-lg-5">
                <h2 className="text-uppercase text-primary d-block mb-3" data-aos="fade-right" data-aos-delay="300">2-Factor
                  Authentication</h2>
                <p className="mb-4" data-aos="fade-right" data-aos-delay="400">2FA is a standard in today's web security. Our cloud wallet supports 2FA out of the box.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="landing-site-footer">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-4">
              <h2 className="footer-heading text-uppercase mb-4">About</h2>
              <p>Conceal.Network is a decentralized blockchain bank, with deposits and investments paying interest rates, without involvement of financial institutions, powered by 100% open source code.</p>
            </div>
            <div className="col-md-3 ml-auto">
              <h2 className="footer-heading text-uppercase mb-4">Quick Links</h2>
              <ul className="list-unstyled" id="listQuickLinks">
                <a href="https://conceal.network/" className="p-2">Website</a>
                <a href="https://conceal.network/wiki/doku.php" className="p-2">Documentation</a>
                <a href="https://discord.conceal.network" className="p-2">Discord</a>
                <a href="https://t.co/55klBHKGUR" className="p-2">Telegram</a>
                <a href="https://www.reddit.com/r/ConcealNetwork/" className="p-2">Reddit</a>
                <a href="https://bitcointalk.org/index.php?topic=5086106" className="p-2">Bitcointalk</a>
              </ul>
            </div>
            <div className="col-md-4">
              <h2 className="footer-heading text-uppercase mb-4">Connect with Us</h2>
              <p>
                <a href="https://www.facebook.com/concealnetwork" className="p-2 pl-0"><FaFacebook /></a>
                <a href="https://twitter.com/ConcealNetwork" className="p-2"><FaTwitter /></a>
                <a href="https://medium.com/@ConcealNetwork" className="p-2"><FaMedium /></a>
                <a href="https://github.com/ConcealNetwork" className="p-2"><FaGithub /></a>
                <a href="https://discord.conceal.network" className="p-2"><FaDiscord /></a>
                <a href="https://t.co/55klBHKGUR" className="p-2"><FaTelegram /></a>
              </p>
            </div>
          </div>
          <div className="row">

            <div className="col-md-12 text-center">
              <div className="border-top pt-5">
                <p>
                  Copyright &copy;
                  <script>{new Date().getFullYear()}</script> All rights reserved | Conceal Network
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
