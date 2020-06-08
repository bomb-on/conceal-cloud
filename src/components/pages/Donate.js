import React, { useContext, useState } from 'react';
import WAValidator from 'multicoin-address-validator';

import { AppContext } from '../ContextProvider';
import FormLabelDescription from '../elements/FormLabelDescription';
import WalletDropdown from '../elements/WalletDropdown';
import { useCalculatedValues, useFormInput, useSendFormValidation } from '../../helpers/hooks';
import { FormattedAmount } from '../../helpers/utils';


const Donate = props => {
  const { actions, state } = useContext(AppContext);
  const { sendTx } = actions;
  const { appSettings, layout, marketData, userSettings, wallets } = state;
  const { coinDecimals, defaultFee, messageLimit } = appSettings;
  const { formSubmitted, walletsLoaded } = layout;

  const params = new URLSearchParams(props.location.search);
  const address = params.get('address') || props.match.params.address;
  const addressValid = WAValidator.validate(address, 'CCX');
  const recipientName = params.get('recipientName') || props.match.params.recipientName;

  const { value: amount, bind: bindAmount, reset: resetAmount } = useFormInput(params.get('amount') || '');
  const { value: message, bind: bindMessage, reset: resetMessage } = useFormInput(params.get('message') || '');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const { btcValue, usdValue } = useCalculatedValues(amount, marketData);
  const [availableWallets, setAvailableWallets] = useState({});
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const maxValue = wallet ? (wallet.balance - wallet.locked - defaultFee).toFixed(coinDecimals) : 0;

  const formValid = useSendFormValidation({
    amount,
    appSettings,
    fromAddress: walletAddress,
    password,
    toAddress: address,
    twoFACode,
    userSettings,
    wallet,
  });

  return (
    <div className="donatePage">
      <div className="donateWrapper">
        <h6 className="slim-pagetitle">Conceal Pay</h6>

        {!addressValid &&
          <div className="mg-t-15">
            <h5>Invalid Payment Address</h5>
            Please verify that Conceal address is valid.
          </div>
        }

        {addressValid &&
          <>
            <form
              onSubmit={e =>
                sendTx(
                  {
                    e,
                    wallet: walletAddress,
                    address,
                    amount,
                    message,
                    twoFACode,
                    password,
                    id: 'donateForm',
                  },
                  [
                    resetAmount,
                    resetMessage,
                    resetTwoFACode,
                    resetPassword,
                  ],
                )
              }
            >
              <div className="row donateData">
                <div className="col-lg-12">
                  <div className="form-layout form-layout-7 donate-form">
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-2">
                        Pay to
                        <FormLabelDescription>Receiver's address</FormLabelDescription>
                      </div>
                      <div
                        className="col-7 col-sm-10 wallet-address">{address} {recipientName && `(${recipientName})`}</div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-2">
                        From Wallet
                        <FormLabelDescription>Your wallet from which funds will be sent</FormLabelDescription>
                      </div>
                      <div className="col-7 col-sm-10">
                        <WalletDropdown
                          availableWallets={availableWallets}
                          setWallet={setWallet}
                          setWalletAddress={setWalletAddress}
                          setAvailableWallets={setAvailableWallets}
                          walletAddress={walletAddress}
                          wallets={wallets}
                          walletsLoaded={walletsLoaded}
                          currentAddress={address}
                        />
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-2">
                        Amount
                        <FormLabelDescription>Amount of CCX to send</FormLabelDescription>
                      </div>
                      <div className="col-7 col-sm-10">
                        <input
                          {...bindAmount}
                          size={2}
                          className="form-control autoWidth float-left"
                          placeholder="Amount"
                          name="amount"
                          type="number"
                          min={0}
                          max={maxValue}
                          step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
                          disabled={Object.keys(availableWallets).length === 0}
                        />
                        <div className="float-left mg-l-10">
                          <FormattedAmount amount={btcValue} currency="BTC" /><br />
                          <FormattedAmount amount={usdValue} currency="USD" />
                        </div>
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-2">
                        Message
                        <FormLabelDescription>Optional message to include in this transaction</FormLabelDescription>
                      </div>
                      <div className="col-7 col-sm-10">
                        <div className="input-group">
                          <input
                            {...bindMessage}
                            size={6}
                            className="form-control"
                            placeholder="Message"
                            name="message"
                            type="text"
                            maxLength={messageLimit}
                            disabled={Object.keys(availableWallets).length === 0}
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
                      {userSettings.twoFAEnabled
                        ? <>
                            <div className="col-5 col-sm-2">
                              2FA Code
                              <FormLabelDescription>2 Factor Authentication code</FormLabelDescription>
                            </div>
                            <div className="col-7 col-sm-10">
                              <input
                                {...bindTwoFACode}
                                size={6}
                                placeholder="2 Factor Authentication"
                                className="form-control autoWidth"
                                name="twoFACode"
                                type="number"
                                minLength={6}
                                maxLength={6}
                                disabled={Object.keys(availableWallets).length === 0}
                              />
                            </div>
                          </>
                        : <>
                            <div className="col-5 col-sm-2">
                              Password
                              <FormLabelDescription>Your password</FormLabelDescription>
                            </div>
                            <div className="col-7 col-sm-10">
                              <input
                                {...bindPassword}
                                size={6}
                                className="form-control"
                                placeholder="Password"
                                name="password"
                                type="password"
                                minLength={8}
                                disabled={Object.keys(availableWallets).length === 0}
                                autoComplete="new-password"
                              />
                            </div>
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={`btn btn-uppercase-sm btn-send ${formValid ? 'btn-outline-success' : 'btn-outline-danger'}`}
                  disabled={formSubmitted || !formValid}
                >
                  SEND
                </button>
              </div>
            </form>
          </>
        }
      </div>
    </div>
  )
};

export default Donate;
