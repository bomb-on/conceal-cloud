import React, { useEffect, useState, useContext } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import WAValidator from 'multicoin-address-validator';

import { AppContext } from '../../ContextProvider';
import { useFormInput, useFormValidation, useTypeaheadInput } from '../../../helpers/hooks';
import CopyButton from '../CopyButton';


const DonationForm = () => {
  const { state } = useContext(AppContext);
  const { appSettings, wallets } = state;
  const { coinDecimals } = appSettings;

  const { value: donationWallet, bind: bindDonationWallet } = useTypeaheadInput('');
  const { value: recipientName, bind: bindRecipientName } = useFormInput('');
  const { value: amount, bind: bindAmount } = useFormInput('');
  const { value: message, bind: bindMessage } = useFormInput('');
  const [donationHTML, setDonationHTML] = useState(null);
  const [donationURL, setDonationURL] = useState(null);

  const donationFormValid = useFormValidation(WAValidator.validate(donationWallet, 'CCX'));

  useEffect(() => {
    let url = appSettings.donationURL;
    if (donationWallet) url = `${url} ?address=${donationWallet}`;
    if (recipientName) url = `${url}&recipientName=${encodeURIComponent(recipientName)}`;
    if (amount) url = `${url}&amount=${encodeURIComponent(amount)}`;
    if (message) url = `${url}&message=${encodeURIComponent(message)}`;
    if (donationWallet === '') url = null;
    let donateHTML = url
      ? `<a href="${url}" target="_blank">DONATE</a>`
      : null;
    setDonationHTML(donateHTML);
    setDonationURL(url);
  }, [donationWallet, recipientName, amount, message, appSettings.donationURL]);

  const handleDonationURLFocus = event => event.target.firstChild
    ? event.target.firstChild.select()
    : event.target.select();

  return (
    <>
      <form>
        <div className="input-group donationInfo">
          <Typeahead
            {...bindDonationWallet}
            id="donationWallet"
            labelKey="donationWallet"
            options={Object.keys(wallets)}
            placeholder="Address"
            emptyLabel="No wallets available"
            highlightOnlyResult
            selectHintOnEnter
            minLength={1}
            bodyContainer
          />
          <input
            {...bindRecipientName}
            type="text"
            placeholder="Recipient Name (optional)"
            name="recipientName"
            className="form-control rbt-input-main"
            maxLength={64}
          />
        </div>
        <div className="input-group donationInfo">
          <input
            {...bindAmount}
            type="number"
            placeholder="Amount (optional)"
            name="amount"
            className="form-control rbt-input-main"
            step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
          />
          <input
            {...bindMessage}
            type="text"
            placeholder="Message (optional)"
            name="message"
            className="form-control rbt-input-main"
          />
        </div>
      </form>
      <div>
        {donationFormValid
          ? <div className="d-flex flex flex-column">
              <div>Use this URL as payment endpoint:</div>
              <div className="d-flex flex flex-row align-items-stretch">
                  <pre className="flex-1 paymentURL" onClick={handleDonationURLFocus}>
                    <input readOnly type="text" value={donationURL} />
                  </pre>
                <div>
                  <CopyButton text={donationURL} toolTipText="Copy URL" />
                </div>
              </div>
              <div>or use HTML code:</div>
              <div className="d-flex flex flex-row align-items-stretch">
                <pre className="flex-1 paymentURL" onClick={handleDonationURLFocus}>
                  <input readOnly type="text" value={donationHTML} />
                </pre>
                <div>
                  <CopyButton text={donationHTML} toolTipText="Copy HTML" />
                </div>
              </div>
            </div>
          : <>Add valid Conceal address to generate URL and HTML code.</>
        }
      </div>
    </>
  )
};

export default DonationForm;
