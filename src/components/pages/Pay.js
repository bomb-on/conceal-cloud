import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import FormLabelDescription from '../elements/FormLabelDescription';
import WalletDropdown from '../elements/WalletDropdown';
import { useCalculatedValues, useFormInput, useSendFormValidation } from '../../helpers/hooks';
import { FormattedAmount } from '../../helpers/utils';


const Pay = () => {
  const [searchParams] = useSearchParams();
  const { actions, state } = useContext(AppContext);
  const { sendTx } = actions;
  const { appSettings, layout, marketData, userSettings, wallets } = state;
  const { messageLimit } = appSettings;
  const { ipn, twoFAEnabled } = userSettings;
  const { formSubmitted, sendTxResponse, walletsLoaded } = layout;

  if (sendTxResponse && sendTxResponse.redirect) {
    setTimeout(() => {
      window.location.href = sendTxResponse.redirect;
    }, 10 * 1000);
  }

  const client = searchParams.get('client') || '';
  const ref = searchParams.get('ref') || '';
  const amountPredefined = searchParams.get('amount') || '';

  const { value: amount, reset: resetAmount, setValue: setAmountValue } = useFormInput(0);
  const { value: message, bind: bindMessage, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const { btcValue, usdValue } = useCalculatedValues(amount, marketData);
  const [availableWallets, setAvailableWallets] = useState({});
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (amountPredefined) setAmountValue(amountPredefined);
  }, [amountPredefined, setAmountValue]);

  const formValid = useSendFormValidation({ amount, appSettings, password, twoFACode, userSettings, wallet });

  return (
    <div className="donatePage">
      <div className="donateWrapper">
        <h6 className="slim-pagetitle">Conceal Pay</h6>

        {walletsLoaded && !ipn &&
          <div className="mg-t-15">
            <h5>Invalid Client Key</h5>
            Verify that Client Key is correct or contact shop owner.
          </div>
        }

        {ipn &&
          <>
            <div className="mg-t-15">
              Conceal.Pay provides merchants with a method for accepting $CCX payments without intermediaries and a focus on privacy, security, and censorship-resistance.
            </div>

            <form
              onSubmit={e =>
                sendTx(
                  {
                    e,
                    wallet: walletAddress,
                    client,
                    amount,
                    message,
                    twoFACode,
                    password,
                    ref,
                    id: 'ipnForm',
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
                  <div className="form-layout form-layout-7">
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-2">
                        Client ID
                        <FormLabelDescription>ID of a client to send funds to</FormLabelDescription>
                      </div>
                      <div className="col-7 col-sm-10 wallet-address">{client}</div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-2">
                        From Wallet
                        <FormLabelDescription>Wallet from which funds will be sent</FormLabelDescription>
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
                        />
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-2">
                        Amount
                        <FormLabelDescription>Amount to send</FormLabelDescription>
                      </div>
                      <div className="col-7 col-sm-10">
                        <input
                          readOnly
                          value={amount}
                          size={2}
                          className="form-control autoWidth float-left"
                          placeholder="Amount"
                          name="amount"
                          type="number"
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
                      {twoFAEnabled
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

              {amount > 0 &&
                <div className="mg-b-10">
                  Sending <strong className="tx-white"><FormattedAmount amount={amount}/></strong> to <strong className="tx-white">{ipn.name}</strong>
                </div>
              }

              <div>
                <button
                  type="reset"
                  className="btn btn-outline-danger btn-uppercase-sm btnIPNS"
                  onClick={() => window.location.replace(ipn.failedIpnUrl)}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className={`btn ${formValid ? 'btn-outline-success' : 'btn-outline-secondary'} btn-uppercase-sm btnIPNS`}
                  disabled={formSubmitted || !formValid}
                >
                  SEND
                </button>
              </div>
              {sendTxResponse && sendTxResponse.redirect &&
                <div>
                  <strong>Payment Successful!</strong> You will be redirected in 10 seconds...
                </div>
              }
            </form>
          </>
        }
      </div>
    </div>
  )
};

export default Pay;
