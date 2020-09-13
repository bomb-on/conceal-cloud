import React from 'react';

import CopyButton from './CopyButton';
import { CCXExplorerLink, FormattedAmount, maskAddress } from '../../helpers/utils';


export const NewTxMessage = props => {
  const { tx } = props;
  return (
    <div className="tx-notification">
      <div><small>{new Date(tx.timestamp).toLocaleString()}</small></div>
      <div>Amount: <FormattedAmount amount={tx.amount}/></div>
      <div><span title={tx.address}>Wallet: {maskAddress(tx.address)}</span></div>
      <div><span title={tx.hash}>Hash: <CCXExplorerLink hash={maskAddress(tx.hash)}/></span></div>
      <div>Status: <strong>{tx.status.toUpperCase()}</strong></div>
    </div>
  )
};

export const TxSentMessage = props => {
  const { tx } = props;
  return (
    <div className="tx-notification">
      <div><small>{new Date().toLocaleString()}</small></div>
      <div><span title={tx.transactionHash}>Hash: <CCXExplorerLink hash={maskAddress(tx.transactionHash)}/></span></div>
      <div>
        <span title={tx.transactionSecretKey}>Secret Key: {maskAddress(tx.transactionSecretKey)}</span>
        <CopyButton classNames={['btn-notification-copy']} text={tx.transactionSecretKey} toolTipText="Copy Secret Key"/>
      </div>
    </div>
  )
};
