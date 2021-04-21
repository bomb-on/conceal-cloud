import React, { useContext, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import { AppContext } from '../ContextProvider';
import { useTypeaheadInput } from '../../helpers/hooks';
import { maskAddress } from '../../helpers/utils';

const WalletInput = (props) => {
  const { state } = useContext(AppContext);
  const { user } = state;
  const {
    className,
    emptyLabel,
    filterBy,
    hideAddon,
    inputName,
    minLength,
    placeholder,
    setAddress,
    setSaveToAddressBook,
    wallets,
  } = props;

  const { value: address, bind: bindAddress } = useTypeaheadInput('');

  const options = wallets || user.addressBook;

  useEffect(() => { setAddress(address) }, [address, setAddress]);

  return (
    <div className="input-group wallet-input-group">
      <Typeahead
        {...bindAddress}
        className={className || 'form-control'}
        id={inputName || 'address'}
        name={inputName || 'address'}
        labelKey={inputName || 'address'}
        filterBy={filterBy || ['address', 'label', 'paymentID']}
        options={options}
        placeholder={placeholder || ''}
        emptyLabel={emptyLabel || 'No records in Address Book.'}
        highlightOnlyResult
        selectHintOnEnter
        minLength={minLength}
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
      {!hideAddon &&
        <div className="input-group-append">
          <span className="input-group-text">
            <label className="ckbox">
              <input type="checkbox" onChange={setSaveToAddressBook} />
              <span>SAVE TO ADDRESS BOOK</span>
            </label>
          </span>
        </div>
      }
    </div>
  )
};

export default WalletInput;
