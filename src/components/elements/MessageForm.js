import React, { createRef, useContext, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import WAValidator from 'multicoin-address-validator';

import { AppContext } from '../ContextProvider';
import FormLabelDescription from './FormLabelDescription';
import { useFormInput, useFormValidation, useTypeaheadInput } from '../../helpers/hooks';
import { FormattedAmount, maskAddress } from '../../helpers/utils';


const MessageForm = props => {
  const { actions, state } = useContext(AppContext);
  const { sendMessage } = actions;
  const { appSettings, layout, user, userSettings } = state;
  const { messageFee, messageLimit } = appSettings;
  const { formSubmitted, sendMessageResponse } = layout;
  const { wallet } = props;

  const { value: address, bind: bindAddress } = useTypeaheadInput('');
  const { value: message, bind: bindMessage, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');

  const addressInput = createRef();
  const resetAddressInput = () => addressInput.current.clear();

  const [sdm,] = useState(0);

  const totalMessageFee = message.length > 0 ? messageFee : 0;

  const formValidation = (
    address !== props.address &&
    (WAValidator.validate(address, 'CCX') || new RegExp(/^[a-z0-9]*\.conceal\.id/).test(address)) &&
    message.length > 0 &&
    message.length <= messageLimit &&
    totalMessageFee > 0 &&
    totalMessageFee <= wallet.balance &&
    (userSettings.twoFAEnabled
        ? (parseInt(twoFACode) && twoFACode.toString().length === 6)
        : (password !== '' && password.length >= 8)
    )
  );
  const formValid = useFormValidation(formValidation);

  return (
    <div className="form-layout form-layout-7">
      <form
        className="send-form"
        onSubmit={e =>
          {
            sendMessage(
              {
                e,
                wallet: props.address,
                address,
                message,
                sdm,
                twoFACode,
                password,
                id: 'sendMessageForm',
              },
              [
                resetMessage,
                resetTwoFACode,
                resetPassword,
              ],
            );
            resetAddressInput();
          }
        }
      >
        <div className="form-layout form-layout-7">

          <div className="row no-gutters">
            <div className="col-5 col-sm-3">
              From
              <FormLabelDescription>From address</FormLabelDescription>
            </div>
            <div className="col-7 col-sm-9 wallet-address">
              {props.address}
            </div>
          </div>

          <div className="row no-gutters">
            <div className="col-5 col-sm-3">
              To
              <FormLabelDescription>To address</FormLabelDescription>
            </div>
            <div className="col-7 col-sm-9">
              <Typeahead
                ref={addressInput}
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
              Message
              <FormLabelDescription>Message text</FormLabelDescription>
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
          </div>
          <span className="tx-right sendSummary">
            <h2>
              <span className="tx-total-text">TOTAL</span>&nbsp;
              <span className={`${totalMessageFee > wallet.balance ? 'text-danger' : ''}`}>
                <FormattedAmount amount={totalMessageFee} />
              </span>
            </h2>
            <div>
              <span className="tx-available-text">AVAILABLE: </span>
              <strong>
                <FormattedAmount amount={wallet.balance} />
              </strong>
            </div>
          </span>
        </div>
        {sendMessageResponse &&
        <div className={`${sendMessageResponse.status}-message`}>
          {
            sendMessageResponse.status === 'error'
              ? <div className="text-danger">{sendMessageResponse.message}</div>
              : <>
                  TX Hash: <a
                  href={`${appSettings.explorerURL}/index.html?hash=${sendMessageResponse.message.transactionHash}#blockchain_transaction`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sendMessageResponse.message.transactionHash}
                </a><br />
                  Secret Key: {sendMessageResponse.message.transactionSecretKey}
                </>
          }
        </div>
        }
      </form>
      <hr />
    </div>
  );
};

export default MessageForm;
