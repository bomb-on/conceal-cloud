import React, { useContext, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import PortfolioCCX from '../cards/PortfolioCCX';
import PortfolioBTC from '../cards/PortfolioBTC';
import Transactions from '../cards/Transactions';
import Height from '../cards/Height';
import Wallet from '../elements/Wallet';
import MarketStats from '../cards/MarketStats';
import ImportWalletModal from '../modals/ImportWallet';


const Dashboard = props => {
  const { actions, state, ...rest } = useContext(AppContext);
  const { createWallet } = actions;
  const { appSettings, layout, messages, wallets } = state;
  const { walletsLoaded } = layout;

  const [importWalletModalOpen, toggleImportWalletModalOpen] = useState(false);

  const walletsKeys = Object.keys(wallets);

  return (
    <div className="slim-mainpanel">
      <div className="container">

        <div className="slim-pageheader">
          <ol className="breadcrumb slim-breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
          </ol>
          <h6 className="slim-pagetitle">Dashboard</h6>
        </div>

        <div className="card card-dash-one mg-t-20">
          <div className="row no-gutters">
            <div className="col-lg-3"><PortfolioCCX /></div>
            <div className="col-lg-3"><PortfolioBTC /></div>
            <div className="col-lg-3"><Transactions /></div>
            <div className="col-lg-3"><Height /></div>
          </div>
        </div>

        <div className="section-wrapper mg-t-20">
          <div className="d-flex flex-row width-100 justify-content-between mg-b-10">
            <label className="section-title d-inline-block">Your Wallets</label>
            <div>
              {walletsLoaded &&
                <OverlayTrigger
                  overlay={walletsKeys.length >= appSettings.maxWallets
                    ? <Tooltip id="button-create-wallet">
                        Maximum number of wallets created ({appSettings.maxWallets}), please delete wallets which are not
                        in use or create additional wallets with Conceal Desktop.
                      </Tooltip>
                    : <Tooltip id="button-create-wallet-hidden" hidden={true} />
                  }
                >
                  <button
                    className={`btn btn-sm ${walletsKeys.length < appSettings.maxWallets ? 'btn-primary' : 'btn-outline-dark disabled'}`}
                    onClick={() => {
                      if (walletsKeys.length < appSettings.maxWallets) {
                        window.confirm('You are about to create a new wallet. Proceed?') &&
                        createWallet()
                      }
                    }}
                  >
                    CREATE NEW WALLET
                  </button>
                </OverlayTrigger>
              }
              {walletsLoaded &&
                <OverlayTrigger
                  overlay={walletsKeys.length >= appSettings.maxWallets
                    ? <Tooltip id="button-import-wallet">
                      Maximum number of wallets imported ({appSettings.maxWallets + 1}), please delete wallets which are
                      not in use or create/import additional wallets with Conceal Desktop.
                    </Tooltip>
                    : <Tooltip id="button-import-wallet-hidden" hidden={true} />
                  }
                >
                  <button
                    className={`btn btn-sm mg-l-10 ${walletsKeys.length < appSettings.maxWallets + 1 ? 'btn-primary' : 'btn-outline-dark disabled'}`}
                    onClick={() => {
                      if (walletsKeys.length < appSettings.maxWallets + 1) {
                        toggleImportWalletModalOpen(!importWalletModalOpen);
                      }
                    }}
                  >
                    IMPORT WALLET
                  </button>
                </OverlayTrigger>
              }
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="list-group list-group-user">
                {walletsLoaded &&
                <>
                  {
                    walletsKeys.length > 0 &&
                    walletsKeys.map(address =>
                      <Wallet
                        key={address}
                        wallet={wallets[address]}
                        messages={messages[address] || []}
                        address={address} />
                      )
                  }
                  {walletsKeys.length === 0 &&
                    <div className="section-title text-center">You don't have any wallets. Please create one</div>
                  }
                </>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="row row-sm mg-t-20 flex-stretch-vertical">
          <div className="col-lg-12"><MarketStats /></div>
        </div>

        <ImportWalletModal
          {...rest}
          show={importWalletModalOpen}
          toggleModal={() => toggleImportWalletModalOpen(!importWalletModalOpen)}
        />

      </div>
    </div>
  )
};

export default Dashboard;
