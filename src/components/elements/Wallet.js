import React, { useState, useContext } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaArrowDown, FaArrowUp, FaComments, FaKey, FaListAlt, FaTrashAlt } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';

import { AppContext } from '../ContextProvider';
import { FormattedAmount, maskAddress } from '../../helpers/utils';
import SendModal from '../modals/Send';
import ReceiveModal from '../modals/Receive';
import MessagesModal from '../modals/Messages';
import DetailsModal from '../modals/Details';
import KeysModal from '../modals/Keys';


const Wallet = props => {
  const { actions, state } = useContext(AppContext);
  const { deleteWallet } = actions;
  const { layout } = state;
  const { messagesLoaded, walletsLoaded } = layout;

  const [sendModalOpen, toggleSendModal] = useState(false);
  const [receiveModalOpen, toggleReceiveModal] = useState(false);
  const [messagesModalOpen, toggleMessagesModal] = useState(false);
  const [detailsModalOpen, toggleDetailsModal] = useState(false);
  const [keysModalOpen, toggleKeysModal] = useState(false);

  const wallet = props.wallet;
  const txs = wallet.transactions || [];
  const txIn = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'received') : [];
  const txOut = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'sent') : [];
  const locked = wallet.locked || 0;
  const balanceTotal = wallet.total || 0;

  return (
    <div className="list-group-item">
      <div className="user-name-address">
        <p>{maskAddress(props.address)}</p>
        {wallet.corrupted
          ? <>
              <span>
                <span className="text-danger">
                  <IoIosWarning size="1rem" className="icon-warning" /> <strong>Wallet no longer available.</strong>
                </span>
                <span className="text-warning">
                  Please import your previously exported keys to the desktop Conceal Wallet.
                </span>
              </span>
            </>
          : <>
              <span>
                Balance: <FormattedAmount amount={balanceTotal} />&nbsp;
                {locked > 0 &&
                  <span className="tx-pending d-inline-block">
                    (Locked: <FormattedAmount amount={locked} showCurrency={false} />)
                  </span>
                }
              </span>
              <span>Transactions in: {txIn.length.toLocaleString()}</span>
              <span>Transactions out: {txOut.length.toLocaleString()}</span>
            </>
        }
      </div>

      <div className="btn-group" role="group">
        <OverlayTrigger overlay={<Tooltip id={`${props.address}-send`}>Send CCX</Tooltip>}>
          <span>
            <button
              className={`btn btn-outline-dark ${!walletsLoaded || balanceTotal === 0 || balanceTotal === locked ? 'disabled' : ''}`}
              onClick={() => toggleSendModal(!sendModalOpen)}
              disabled={!walletsLoaded || balanceTotal === 0 || balanceTotal === locked || wallet.corrupted}
            >
              <FaArrowUp />
            </button>
          </span>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip id={`${props.address}-receive`}>Receive CCX</Tooltip>}>
          <button
            className={`btn btn-outline-dark ${!walletsLoaded ? 'disabled' : ''}`}
            onClick={() => toggleReceiveModal(!receiveModalOpen)}
            disabled={!walletsLoaded || wallet.corrupted}
          >
            <FaArrowDown />
          </button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip id={`${props.address}-messages`}>Messages</Tooltip>}>
          <button
            className={`btn btn-outline-dark ${!messagesLoaded ? 'disabled' : ''}`}
            onClick={() => toggleMessagesModal(!messagesModalOpen)}
            disabled={!messagesLoaded || wallet.corrupted}
          >
            <FaComments />
          </button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip id={`${props.address}-txs`}>Transactions</Tooltip>}>
          <span>
            <button
              className={`btn btn-outline-dark ${!walletsLoaded || txs.length === 0 ? 'disabled' : ''}`}
              onClick={() => toggleDetailsModal(!detailsModalOpen)}
              disabled={!walletsLoaded || txs.length === 0 || wallet.corrupted}
            >
              <FaListAlt />
            </button>
          </span>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip id={`${props.address}-keys`}>Export Keys</Tooltip>}>
          <button
            className={`btn btn-outline-dark ${!walletsLoaded ? 'disabled' : ''}`}
            onClick={() => toggleKeysModal(!keysModalOpen)}
            disabled={!walletsLoaded || wallet.corrupted}
          >
            <FaKey />
          </button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip id={`${props.address}-delete`}>Delete Wallet</Tooltip>}>
          <span>
            <button
              className={`btn btn-outline-${wallet.corrupted ? 'danger' : 'dark'} ${!walletsLoaded || balanceTotal !== 0 ? 'disabled' : ''}`}
              onClick={() => {
                window.confirm('You are about to delete this wallet PERMANENTLY! Do you really wish to proceed?') &&
                deleteWallet(props.address);
              }}
              disabled={!walletsLoaded || balanceTotal !== 0}
            >
              <FaTrashAlt/>
            </button>
          </span>
        </OverlayTrigger>
      </div>

      <SendModal
        {...props}
        show={sendModalOpen}
        toggleModal={() => toggleSendModal(!sendModalOpen)}
        wallet={wallet}
      />

      <ReceiveModal
        {...props}
        show={receiveModalOpen}
        toggleModal={() => toggleReceiveModal(!receiveModalOpen)}
      />

      <MessagesModal
        {...props}
        show={messagesModalOpen}
        toggleModal={() => toggleMessagesModal(!messagesModalOpen)}
      />

      <DetailsModal
        {...props}
        show={detailsModalOpen}
        toggleModal={() => toggleDetailsModal(!detailsModalOpen)}
        wallet={wallet}
      />

      <KeysModal
        {...props}
        show={keysModalOpen}
        toggleModal={() => toggleKeysModal(!keysModalOpen)}
        wallet={wallet}
      />
    </div>
  )
};

export default Wallet;
