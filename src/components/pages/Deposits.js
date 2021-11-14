import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactSlider from 'react-slider';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';
import { RiHandCoinLine } from 'react-icons/ri';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';
import FormLabelDescription from '../elements/FormLabelDescription';
import { FormattedAmount } from '../../helpers/utils';
import WalletInput from '../elements/WalletInput';


const Deposits = () => {
  const { actions, state } = useContext(AppContext);
  const { createDeposit, getDeposits, unlockDeposit } = actions;
  const { appSettings, deposits, layout, network, userSettings, wallets } = state;
  const { formSubmitted } = layout;
  const {
    coinDecimals,
    coinDifficultyTarget,
    depositFee,
    depositBlocksPerMonth,
    depositInterestRate,
    depositMinTerm,
    depositMaxTerm,
  } = appSettings;

  const { value: amount, bind: bindAmount, setValue: setAmount, reset: resetAmount } = useFormInput(1);
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');

  const tierCoeff = { 1: 0.029, 2: 0.039, 3: 0.049 };
  const [currentTier, setCurrentTier] = useState(1);
  const [currentTerm, setCurrentTerm] = useState(1);
  const [eir, setEir] = useState(depositInterestRate);
  const [tea, setTea] = useState(amount);
  const [maxAmount, setMaxAmount] = useState(1);
  const [wallet, setWallet] = useState(1);

  const handleAddress = address => {
    if (wallets[address]) {
      setMaxAmount(Math.floor(wallets[address].balance - depositFee));
      setWallet(address);
    }
  };

  const handleTier = e => {
    const val = e.target ? parseInt(e.target.value) : e;
    let tier = 1;
    if (val >= 10000) tier = 2;
    if (val >= 20000) tier = 3;
    setCurrentTier(tier);
  };

  const handleTerm = e => {
    let t = e ? e.target.value : 1;
    if (t < 1) t = depositMinTerm;
    if (t > 12) t = depositMaxTerm;
    setCurrentTerm(t);
  }

  const resetTerm = () => setCurrentTerm(1);

  const onSliderChange = e => setAmount(parseInt(e));
  const handlePercentage = p => maxAmount > 1 && setAmount(parseInt(maxAmount * p / 100));

  const calculateDeposit = () => {
    const ear = tierCoeff[currentTier] + (Number(currentTerm) - 1) * 0.001;
    const eir = ear/12 * Number(currentTerm);
    const tea = eir > 0 ? amount * (1 + eir) : 0;
    setEir(eir);
    setTea(tea);
    handleTier(amount);
  };

  useEffect(() => {
    calculateDeposit();
  }, [amount, currentTier, currentTerm]);

  const formValidation = (
    wallet &&
    amount >= 1 && amount <= maxAmount &&
    currentTerm >= depositMinTerm && currentTerm <= depositMaxTerm &&
    twoFACode.length === 6
  );

  const formValid = useFormValidation(formValidation);

  useEffect(() => {
    getDeposits();
    calculateDeposit();
  }, []);

  return (
    <div>
      <div className="slim-mainpanel">
        <div className="container">

          <div className="slim-pageheader">
            <ol className="breadcrumb slim-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Deposits</li>
            </ol>
            <h6 className="slim-pagetitle">Deposits</h6>
          </div>

          <div className="section-wrapper mg-t-20">
            <div className="row">
              <div className="col-lg-7">
                <label className="section-title">New Deposit</label>
                <form
                  onSubmit={e => createDeposit(
                    { e, amount, password, term: currentTerm * depositBlocksPerMonth, twoFACode, wallet, id: 'depositForm' },
                    [resetAmount, resetPassword, resetTerm, resetTwoFACode],
                  )}
                >
                  <div className="form-layout form-layout-7">
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-4">
                        <div>
                          Wallet <FormLabelDescription>Wallet to use for deposit</FormLabelDescription>
                        </div>
                      </div>
                      <div className="col-7 col-sm-8 wallet-address">
                        <WalletInput
                          emptyLabel="No wallets found."
                          filterBy={['address']}
                          hideAddon={true}
                          placeholder="Select wallet with enough funds"
                          setAddress={handleAddress}
                          minLength={0}
                          wallets={
                            Object.keys(wallets).reduce((a, address) => {
                              if (wallets[address].balance > 1 + depositFee) a.push({ address });
                              return a;
                            }, [])
                          }
                        />
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-4">
                        Amount
                        <FormLabelDescription>Amount of CCX to deposit (lock)</FormLabelDescription>
                      </div>
                      <div className="col-7 col-sm-8">
                        <div className="input-group">
                          <input
                            {...bindAmount}
                            size={2}
                            placeholder="Amount"
                            className="form-control"
                            name="amount"
                            type="number"
                            min={0}
                            max={maxAmount}
                            step={1}
                          />
                          <span className="input-group-btn">CCX</span>
                        </div>
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-4">
                        Time
                        <FormLabelDescription>Months</FormLabelDescription>
                      </div>
                      <div className="col-7 col-sm-8">
                        <div className="input-group">
                          <input
                            value={currentTerm}
                            onChange={handleTerm}
                            placeholder="Time"
                            className="form-control"
                            name="time"
                            type="number"
                            min={depositMinTerm}
                            max={depositMaxTerm}
                            size={2}
                            step={1}
                          />
                          <span className="input-group-btn">Month{currentTerm > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                    </div>
                    {userSettings.twoFAEnabled
                      ? <div className="row no-gutters">
                          <div className="col-5 col-sm-4">
                            2FA
                            <FormLabelDescription>2 Factor Authentication code</FormLabelDescription>
                          </div>
                          <div className="col-7 col-sm-8">
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
                          <div className="col-5 col-sm-4">
                            Password
                            <FormLabelDescription>Your password</FormLabelDescription>
                          </div>
                          <div className="col-7 col-sm-8">
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

                  <div className="horizontal-slider-container">
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="slider-thumb"
                      trackClassName="slider-track"
                      min={1}
                      max={maxAmount}
                      onChange={onSliderChange}
                      value={amount <= maxAmount ? amount : 1}
                    />
                    <div className="slider-percentages">
                      <button onClick={() => handlePercentage(0)}>0%</button>
                      <button onClick={() => handlePercentage(25)}>25%</button>
                      <button onClick={() => handlePercentage(50)}>50%</button>
                      <button onClick={() => handlePercentage(75)}>75%</button>
                      <button onClick={() => handlePercentage(100)}>100%</button>
                    </div>
                  </div>

                  <div className="d-flex flex-row justify-content-between new-deposit-details">
                    <div>
                      <h5>Deposit details</h5>
                      <div>Interest rate: <span className="text-white">{(eir * 100).toFixed(6)}%</span></div>
                      <div>Rewards: <span className="text-white"><FormattedAmount amount={(tea - amount)} /></span></div>
                      <div>Fees: <span className="text-white"><FormattedAmount amount={depositFee}/></span></div>
                      <div>Blockchain length: <span className="text-white">{currentTerm * depositBlocksPerMonth} blocks</span></div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={formSubmitted || !formValid}
                        className={`btn ${formValid ? 'btn-outline-success' : 'btn-outline-danger'}`}
                      >
                        MAKE DEPOSIT
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-5">
                <label className="section-title">Deposits History</label>
                {deposits && deposits.length > 0
                ? <div className="table-responsive">
                    <table className="table table-striped table-hover mg-b-0">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Amount</th>
                          <th>Unlock time</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deposits.map(deposit => {
                          let status = 'Locked';
                          let statusIcon = <BiLockAlt className="text-danger" />
                          if (!deposit.locked) {
                            status = 'Unlocked';
                            statusIcon = <BiLockOpenAlt className="text-success" />
                          }
                          if (deposit.spendingTransactionHash) {
                            status = 'Spent';
                            statusIcon = <RiHandCoinLine className="text-success" />
                          }
                          const depositAmount = deposit.amount / Math.pow(10, coinDecimals);
                          const blocksLeft = deposit.unlockHeight - network.blockchainHeight;

                          return (
                            <tr key={`tr-${deposit.creatingTransactionHash}`}>
                              <td className="align-middle">
                                {statusIcon} {status}
                              </td>
                              <td>
                                <FormattedAmount amount={depositAmount} showCurrency={false} />
                              </td>
                              <td>
                                {
                                  moment()
                                    .add(blocksLeft * coinDifficultyTarget, 'seconds')
                                    .format('YYYY-MM-DD HH:mm')
                                }
                              </td>
                              <td>Deposit</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                : <div>You have no deposits yet.</div>
                }
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-lg-12">
                <label className="section-title">Current Deposits</label>
                {deposits && deposits.length > 0
                  ? <div className="current-deposits">
                      <ul className="list-group">
                        {deposits.filter(i => i.spendingTransactionHash === "").map(deposit => {
                          const depositAmount = deposit.amount / Math.pow(10, coinDecimals);

                          let tier = 1;
                          if (depositAmount >= 10000) tier = 2;
                          if (depositAmount >= 20000) tier = 3;
                          let depositTerm = deposit.term / depositBlocksPerMonth;
                          const ear = tierCoeff[tier] + (depositTerm - 1) * 0.001;
                          const eir = ear/12 * depositTerm;

                          const depositInterest = deposit.interest / Math.pow(10, coinDecimals);
                          const depositInterestPercentage = (eir * 100).toFixed(6);
                          const totalBlocks = deposit.unlockHeight - deposit.height;
                          const blocksLeft = deposit.unlockHeight - network.blockchainHeight;
                          const progressPercentage = Math.floor(((totalBlocks - blocksLeft) / totalBlocks) * 100) > 100
                            ? 100
                            : Math.floor(((totalBlocks - blocksLeft) / totalBlocks) * 100);
                          const depositTimestamp = moment(deposit.timestamp).format('YYYY-MM-DD HH:mm UTC');
                          const depositExpectedEnd = moment()
                            .add(blocksLeft * (coinDifficultyTarget), 'seconds')
                            .format('YYYY-MM-DD HH:mm UTC');
                          return (
                            <li key={`li-${deposit.creatingTransactionHash}`} className="list-group-item">
                              <div className="d-flex flex-row justify-content-between current-deposit-details">
                                <div className="current-deposit-start">
                                  Creating height: {deposit.height.toLocaleString()}
                                  <br/>
                                  Start date: {depositTimestamp}
                                  <br/>
                                  Amount: <FormattedAmount amount={depositAmount}/>
                                </div>
                                <div className="text-right current-deposit-end">
                                  {progressPercentage === 100
                                    ? <button
                                        className="btn btn-outline-success"
                                        onClick={() => unlockDeposit(deposit.depositId)}
                                      >
                                        WITHDRAW
                                      </button>
                                    : <>
                                        Unlock height: {deposit.unlockHeight.toLocaleString()}&nbsp;
                                        <small>({blocksLeft} blocks left)</small>
                                        <br/>
                                        Expected unlock time: {depositExpectedEnd}
                                        <br/>
                                        Interest: <FormattedAmount amount={depositInterest}/>&nbsp;
                                        <small>({depositInterestPercentage}%)</small>
                                      </>
                                  }
                                </div>
                              </div>
                              <div className="progress mg-b-10">
                                <div
                                  className={`progress-bar progress-bar-striped bg-warning wd-${Math.ceil(progressPercentage/5)*5}p`}
                                  role="progressbar"
                                  aria-valuenow={progressPercentage}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  {progressPercentage}%
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  : <div>Once created and confirmed, your deposits will be listed here.</div>
                }
              </div>
            </div>

            <hr />

            <div>
              For more information about Conceal deposits, please visit&nbsp;
              <a href="https://conceal.network/wiki/doku.php?id=banking" target="_blank" rel="noopener noreferrer">Conceal Wiki</a>.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Deposits;
