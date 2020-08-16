import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Typeahead } from 'react-bootstrap-typeahead';
import QrReader from 'react-qr-reader';

import { AppContext } from '../ContextProvider';
import FormLabelDescription from '../elements/FormLabelDescription';
import WalletDropdown from '../elements/WalletDropdown';
import { useFormInput, useSendFormValidation, useTypeaheadInput } from '../../helpers/hooks';
import { FormattedAmount, maskAddress } from '../../helpers/utils';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';


const SendModal = props => {
  const { actions, state } = useContext(AppContext);
  const { sendTx } = actions;
  const { appSettings, layout, user, userSettings, wallets } = state;
  const { coinDecimals, defaultFee, messageLimit } = appSettings;
  const { formSubmitted, walletsLoaded } = layout;
  const { toggleModal, wallet, ...rest } = props;

  const [availableWallets, setAvailableWallets] = useState({});
  const [selectedWallet, setSelectedWallet] = useState(wallet || { balance: 0 });
  const [walletAddress, setWalletAddress] = useState('');
  const [qrReaderOpened, setQrReaderOpened] = useState(false);

  const { value: address, bind: bindAddress, reset: resetAddress, paymentIDValue } = useTypeaheadInput(props.contact ? props.contact.address : '');
  const { value: paymentID, bind: bindPaymentID, setValue: setPaymentIDValue, reset: resetPaymentID } = useFormInput(props.contact ? props.contact.paymentID : '');
  const { value: amount, bind: bindAmount, setValue: setAmountValue, reset: resetAmount } = useFormInput('');
  const { value: message, bind: bindMessage, setValue: setMessageValue, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const { value: label, bind: bindLabel, setValue: setLabelValue, reset: resetLabel } = useFormInput('');

  const parsedAmount = !Number.isNaN(parseFloat(amount)) ? parseFloat(amount) : 0;
  const totalAmount = parsedAmount > 0 ? parseFloat((parsedAmount + defaultFee).toFixed(coinDecimals)) : 0;
  const [maxValue, setMaxValue] = useState((selectedWallet.balance - defaultFee).toFixed(coinDecimals));
  const calculateMax = () => setAmountValue(maxValue);

  useEffect(() => {
    if (wallet) {
      setSelectedWallet(wallet);
      setMaxValue((wallet.balance - defaultFee).toFixed(coinDecimals));
    }
  }, [coinDecimals, defaultFee, wallet]);

  useEffect(() => {
    setPaymentIDValue(paymentIDValue);
  }, [paymentIDValue, setPaymentIDValue]);

  const formValid = useSendFormValidation({
    amount,
    appSettings,
    fromAddress: props.address ? props.address : walletAddress,
    message,
    password,
    paymentID,
    toAddress: address,
    twoFACode,
    userSettings,
    wallet: selectedWallet,
  });

  let addressInput = null;
  const handleScan = data => {
    if (data) {
      const [prefix, ...rest] = data.split(':');
      if (prefix === appSettings.qrCodePrefix) {
        const addressParams = rest.join(':').split('?');
        let event = new Event('input', { bubbles: true });
        addressInput.setState({ text: addressParams[0] });
        addressInput.props.onInputChange(addressParams[0], event);
        if (addressParams.length > 1) {
          const params = addressParams[1].split('&');
          params.forEach(p => {
            const param = p.split('=');
            if (param[0] === 'tx_amount') setAmountValue(param[1]);
            if (param[0] === 'tx_payment_id') setPaymentIDValue(param[1]);
            if (param[0] === 'tx_message') setMessageValue(param[1]);
            if (param[0] === 'tx_label') setLabelValue(param[1]);
          })
        }
      }
      setQrReaderOpened(false);
    }
  };

  const handleError = err => {
    console.error(err)
  };

  const resetAddressInput = () => addressInput.clear();

  return (
    <Modal
      {...rest}
      size="lg"
      id="dlgSendCoins"
      onHide={() => toggleModal('send')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Send CCX</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {qrReaderOpened &&
          <div className="width-100 mg-b-10">
            <QrReader
              className="qr-reader"
              delay={500}
              onError={handleError}
              onScan={handleScan}
            />
          </div>
        }

        <form
          className="send-form"
          onSubmit={e =>
            sendTx(
              {
                e,
                wallet: props.address,
                address,
                paymentID,
                amount,
                message,
                twoFACode,
                password,
                label,
                id: 'sendForm',
              },
              [
                resetAddressInput,
                resetAddress,
                resetPaymentID,
                resetAmount,
                resetMessage,
                resetTwoFACode,
                resetPassword,
                resetLabel,
              ],
            )
          }
        >
          <div className="form-layout form-layout-7">

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                From
                <FormLabelDescription>Address which funds will be sent from</FormLabelDescription>
              </div>
              <div className="col-7 col-sm-9 wallet-address">
                {props.address ||
                  <WalletDropdown
                    availableWallets={availableWallets}
                    setWallet={setSelectedWallet}
                    setWalletAddress={setWalletAddress}
                    setAvailableWallets={setAvailableWallets}
                    walletAddress={walletAddress}
                    wallets={wallets}
                    walletsLoaded={walletsLoaded}
                  />
                }
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                To
                <FormLabelDescription>Address to send funds</FormLabelDescription>
              </div>
              <div className="col-7 col-sm-9">
                <Typeahead
                  ref={component => addressInput = component ? component.getInstance() : addressInput}
                  {...bindAddress}
                  id="address"
                  labelKey="address"
                  filterBy={['address', 'label', 'paymentID']}
                  options={user.addressBook}
                  placeholder="Address"
                  emptyLabel="No records in Address Book"
                  highlightOnlyResult
                  selectHintOnEnter
                  minLength={1}
                  renderMenuItemChildren={option =>
                    <>
                      <strong className="addrDropdownLabel" key="name">
                        {option.label}
                      </strong>
                      <div className="addrDropdownLabel" key="address">
                        <small>
                          Address: <span className="addrDropdownAddress">{maskAddress(option.address)}</span>
                          {option.paymentID &&
                            <span> ( Payment ID: <span className="addrDropdownAddress">{maskAddress(option.paymentID)}</span> )</span>
                          }
                        </small>
                      </div>
                    </>
                  }
                />
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Amount
                <FormLabelDescription>Amount to send</FormLabelDescription>
              </div>
              <div className="col-7 col-sm-9">
                <div className="input-group">
                  <input
                    {...bindAmount}
                    size={2}
                    placeholder="Amount"
                    className="form-control"
                    name="amount"
                    type="number"
                    min={0}
                    max={maxValue}
                    step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
                  />
                  <span className="input-group-btn">
                      <button className="btn btn-outline-secondary btn-max" onClick={calculateMax} type="button">
                        <small><strong>SEND MAX</strong></small>
                      </button>
                    </span>
                </div>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Payment ID (optional)
                <FormLabelDescription>Optional Payment ID for receiving address</FormLabelDescription>
              </div>
              <div className="col-7 col-sm-9">
                <input
                  {...bindPaymentID}
                  size={6}
                  placeholder="Payment ID"
                  className="form-control"
                  name="paymentID"
                  type="text"
                  minLength={64}
                  maxLength={64}
                />
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Message (optional)
                <FormLabelDescription>Optional message to include in this transaction</FormLabelDescription>
              </div>
              <div className="col-7 col-sm-9">
                <div className="input-group">
                  <input
                    {...bindMessage}
                    size={6}
                    placeholder="Message"
                    className="form-control"
                    name="message"
                    type="text"
                    maxLength={messageLimit}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <small>
                        <strong>
                          {message.length}/{messageLimit} Characters
                        </strong>
                      </small>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Label (optional)
                <FormLabelDescription>
                  Add label to automatically add receiving address to Address Book
                </FormLabelDescription>
              </div>
              <div className="col-7 col-sm-9">
                <input
                  {...bindLabel}
                  size={6}
                  placeholder="Label"
                  className="form-control"
                  name="label"
                  type="text"
                  minLength={1}
                />
              </div>
            </div>

            {userSettings.twoFAEnabled
              ? <div className="row no-gutters">
                  <div className="col-5 col-sm-3">
                    2 Factor Authentication
                    <FormLabelDescription>2 Factor Authentication code</FormLabelDescription>
                  </div>
                  <div className="col-7 col-sm-9">
                    <input
                      {...bindTwoFACode}
                      size={6}
                      placeholder="2 Factor Authentication"
                      className="form-control"
                      name="twoFACode"
                      type="number"
                      minLength={6}
                      maxLength={6}
                    />
                  </div>
                </div>
              : <div className="row no-gutters">
                  <div className="col-5 col-sm-3">
                    Password
                    <FormLabelDescription>Your password</FormLabelDescription>
                  </div>
                  <div className="col-7 col-sm-9">
                    <input
                      {...bindPassword}
                      size={6}
                      placeholder="Password"
                      className="form-control"
                      name="password"
                      type="password"
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
            }
          </div>

          <hr />

          <div className="tx-total sendSection">
            <div className="tx-total-btns">
              <button
                type="submit"
                disabled={formSubmitted || !formValid}
                className={`btn btn-send ${formValid ? 'btn-outline-success' : 'btn-outline-danger'}`}
              >
                {formSubmitted ? 'SENDING' : 'SEND'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQrReaderOpened(!qrReaderOpened)}
                disabled={formSubmitted}
              >
                SCAN QR CODE
              </button>
            </div>
            <span className="tx-right sendSummary">
                <h2>
                  <span className="tx-total-text">TOTAL</span>&nbsp;
                  <span className={`${totalAmount > selectedWallet.balance ? 'text-danger' : ''}`}>
                    <FormattedAmount amount={totalAmount} />
                  </span>
                </h2>
                <div className="tx-default-fee-text">
                  FEE: <span className="tx-white"><FormattedAmount amount={defaultFee} /></span>
                </div>
                <div>
                  <span className="tx-available-text">AVAILABLE:</span>&nbsp;
                  <span className="tx-white"><FormattedAmount amount={selectedWallet.balance} /></span>
                </div>
              </span>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('send')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default SendModal;
