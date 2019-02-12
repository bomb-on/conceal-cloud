import React from 'react';
import update from 'immutability-helper';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AuthHelper from './AuthHelper';
import { maskAddress } from '../helpers/address';
import DetailsModal from './modals/Details';
import KeysModal from './modals/Keys';
import ReceiveModal from './modals/Receive';
import SendModal from './modals/Send';


class Wallet extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      coinDecimals: 5,
      detailsModalOpen: false,
      keysModalOpen: false,
      receiveModalOpen: false,
      sendModalOpen: false,
      wallet: {
        balance: null,
        locked: null,
        total: null,
        transactions: [],
        keys: {},
      },
    };

    this.fetchKeys = this.fetchKeys.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const w = this.state.wallet;
    const { wallet } = nextProps;
    if (wallet.transactions && (wallet.transactions.length !== w.transactions.length || wallet.balance !== w.balance)) {
      // console.log(`updating wallet ${wallet.address}...`);
      this.setState(prevState =>
        update(prevState, {
          wallet: { $merge: { ...wallet } }
        }));
    }
  }

  fetchKeys() {
    if (Object.keys(this.state.wallet.keys).length === 0) {
      // console.log('fetching keys...');
      fetch(`${this.props.appSettings.apiEndpoint}/wallet/keys?address=${this.state.wallet.address}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Token': this.Auth.getToken(),
        },
      })
        .then(r => r.json())
        .then(res => {
          this.setState(prevState =>
            update(prevState, {
              wallet: { keys: { $set: res.message } }
            }));
        });
    }
  }

  _toggleModal = (modalName) => {
    this.setState({ [`${modalName}ModalOpen`]: !this.state[`${modalName}ModalOpen`] });
    if (modalName === 'keys') this.fetchKeys();
  };

  render() {
    const {
      coinDecimals,
      detailsModalOpen,
      keysModalOpen,
      receiveModalOpen,
      sendModalOpen,
      wallet,
    } = this.state;
    const { appSettings } = this.props;

    const txs = wallet.transactions || [];
    const txIn = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'received') : [];
    const txOut = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'sent') : [];
    const balance = wallet.balance || 0;

    return (
      <div className="list-group-item">
        {wallet.address &&
          <>
            <div className="user-name-address">
              <p>{maskAddress(wallet.address)}</p>
              <span>Available Balance: {balance.toFixed(coinDecimals)} CCX</span>
              <span>Transactions in: {txIn.length}</span>
              <span>Transactions out: {txOut.length}</span>
            </div>
            <div className="btn-group" role="group">
              <Button
                variant={`outline-secondary ${balance === 0 ? 'disabled' : ''}`}
                onClick={() => this._toggleModal('send')}
                disabled={balance === 0}
              >
                <FontAwesomeIcon icon="arrow-up" />
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => this._toggleModal('receive')}
              >
                <FontAwesomeIcon icon="arrow-down" />
              </Button>
              <Button
                variant={`outline-secondary ${txs.length === 0 ? 'disabled' : ''}`}
                onClick={() => this._toggleModal('details')}
                disabled={txs.length === 0}
              >
                <FontAwesomeIcon icon="list-alt" />
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => this._toggleModal('keys')}
              >
                <FontAwesomeIcon icon="key" />
              </Button>
            </div>
          </>
        }

        <SendModal
          show={sendModalOpen}
          toggleModal={this._toggleModal}
          appSettings={appSettings}
          wallet={wallet}
        />

        <ReceiveModal
          show={receiveModalOpen}
          toggleModal={this._toggleModal}
          wallet={wallet}
        />

        <DetailsModal
          show={detailsModalOpen}
          toggleModal={this._toggleModal}
          appSettings={appSettings}
          txs={txs}
        />

        <KeysModal
          show={keysModalOpen}
          toggleModal={this._toggleModal}
          wallet={wallet}
        />
      </div>
    );
  }
}

export default Wallet;
