import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactSlider from 'react-slider';

import { AppContext } from '../ContextProvider';
import { useFormInput } from '../../helpers/hooks';
import FormLabelDescription from '../elements/FormLabelDescription';
import { FormattedAmount } from '../../helpers/utils';
import WalletInput from '../elements/WalletInput';


const Banking = () => {
  const { state } = useContext(AppContext);
  const { appSettings, wallets } = state;
  const { coinDecimals, depositFee, depositBlocksPerMonth, depositInterestRate } = appSettings;

  const { value: amount, bind: bindAmount, setValue: setAmount } = useFormInput(1);
  const { value: time, bind: bindTime } = useFormInput(1);

  const tierCoeff = { 1: 0.029, 2: 0.039, 3: 0.049 };
  const [currentTier, setCurrentTier] = useState(1);
  const [ear, setEar] = useState(tierCoeff[currentTier]);
  const [eir, setEir] = useState(depositInterestRate);
  const [tea, setTea] = useState(amount);
  const [address, setAddress] = useState(false);
  const [maxAmount, setMaxAmount] = useState(1);

  const handleTier = e => {
    let tier = 1;
    if (e.target.value >= 10000) tier = 2;
    if (e.target.value >= 30000) tier = 3;
    setCurrentTier(tier);
  };

  const onSliderChange = e => {
    console.log(e);
    setAmount(e);
  }

  const handleAddress = e => {
    setAddress(e);
    if (wallets[e]) setMaxAmount(Math.floor(wallets[e].balance - depositFee));
  }

  const handlePercentage = p => {
    if (maxAmount > 1) {
      console.log(p);
      const c = maxAmount * p / 100;
      console.log(c)
      setAmount(maxAmount * p / 100);
    }
  }

  useEffect(() => {
    const ear = tierCoeff[currentTier] + (Number(time) - 1) * 0.001;
    const eir = ear/12 * Number(time);
    const tea = parseFloat(amount) * (1 + eir);
    setEar(ear);
    setEir(eir);
    setTea(tea);
  }, [amount, time]);

  return (
    <div>
      <div className="slim-mainpanel">
        <div className="container">

          <div className="slim-pageheader">
            <ol className="breadcrumb slim-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Banking</li>
            </ol>
            <h6 className="slim-pagetitle">Banking</h6>
          </div>

          <div className="section-wrapper mg-t-20">
            <label className="section-title">Banking</label>
            <div className="row">
              <div className="col-lg-7">
                <h4>New deposit</h4>
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
                          onKeyUp={handleTier}
                          size={2}
                          placeholder="Amount"
                          className="form-control"
                          name="amount"
                          type="number"
                          min={0}
                          max={maxAmount}
                          step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
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
                          {...bindTime}
                          size={2}
                          placeholder="Time"
                          className="form-control"
                          name="time"
                          type="number"
                          min={1}
                          max={12}
                          step={1}
                        />
                        <span className="input-group-btn">Month{time > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-slider-container">
                  <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="slider-thumb"
                    trackClassName="slider-track"
                    min={1}
                    max={maxAmount}
                    onChange={onSliderChange}
                    value={amount}
                    // renderThumb={(props, state) => <div {...props}></div>}
                  />
                  <div className="slider-percentages">
                    <button onClick={() => handlePercentage(0)}>0%</button>
                    <button onClick={() => handlePercentage(25)}>25%</button>
                    <button onClick={() => handlePercentage(50)}>50%</button>
                    <button onClick={() => handlePercentage(75)}>75%</button>
                    <button onClick={() => handlePercentage(100)}>100%</button>
                  </div>
                </div>

                <div>
                  <h5>Deposit details</h5>
                  {/*<div>TIER: {currentTier}</div>
                  <div>EAR: {ear}</div>
                  <div>EIR: {eir}</div>
                  <div>TEA: {tea}</div>*/}
                  <div>Interest rate: {parseFloat((eir).toFixed(6)) * 100}%</div>
                  <div>Rewards: <FormattedAmount amount={(tea - amount)} /></div>
                  <div>Fees: <FormattedAmount amount={depositFee}/></div>
                  <div>Blockchain length: {time * depositBlocksPerMonth} blocks</div>
                </div>
              </div>
              <div className="col-lg-5">
                <h4>Deposit history</h4>
                <div className="table-responsive">
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
                      <tr>
                        <td>Spent</td>
                        <td>1234</td>
                        <td></td>
                        <td>Deposit</td>
                      </tr>
                      <tr>
                        <td>Spent</td>
                        <td>5678</td>
                        <td></td>
                        <td>Deposit</td>
                      </tr>
                      <tr>
                        <td>Spent</td>
                        <td>9012</td>
                        <td></td>
                        <td>Deposit</td>
                      </tr>
                      <tr>
                        <td>Spent</td>
                        <td>3456</td>
                        <td></td>
                        <td>Deposit</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <hr />

            <div>
              For more information about Conceal banking, please visit&nbsp;
              <a href="https://conceal.network/wiki/doku.php?id=banking" target="_blank" rel="noopener noreferrer">Conceal Wiki</a>.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Banking;
