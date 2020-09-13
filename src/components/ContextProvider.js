import React, { useEffect } from 'react';
import { withRouter } from 'react-router';

import AuthHelper from '../helpers/AuthHelper';
import ApiHelper from '../helpers/ApiHelper';
import useAppState from './useAppState';
import { NewTxMessage, TxSentMessage } from './elements/NotificationMessages';
import { showNotification } from '../helpers/utils';


export const AppContext = React.createContext();
const Auth = new AuthHelper();

const AppContextProvider = props => {
  const [state, dispatch, updatedState] = useAppState(Auth);
  const Api = new ApiHelper({ Auth, state });

  const loginUser = options => {
    const { e, email, password, twoFACode, id } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Auth.login(email, password, twoFACode)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'REDIRECT_TO_REFERRER', value: true });
          initApp();
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: res.message, id });
        }
      })
      .catch(err => dispatch({ type: 'DISPLAY_MESSAGE', message: `ERROR ${err}`, id }))
      .finally(() => dispatch({ type: 'FORM_SUBMITTED', value: false }));
  };

  const signUpUser = options => {
    const { e, userName, email, password, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.signUpUser(userName, email, password)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow the instructions to activate your account.';
          return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPassword = options => {
    const { e, email, id } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    Api.resetPassword(email)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow instructions to reset password.';
          Auth.logout();
          clearApp();
          props.history.replace('/');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPasswordConfirm = options => {
    const { e, password, token, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.resetPasswordConfirm(password, token)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = (<>Password successfully changed.<br />Please log in.</>);
          return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const logoutUser = () => {
    clearApp();
    Auth.logout();
    return props.history.replace('/');
  };

  const getUser = () => {
    Api.getUser()
      .then(res => dispatch({ type: 'USER_LOADED', user: res.message }))
      .catch(e => console.error(e));
  };

  const updateUser = ({ e, id, email, avatar }) => {
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.updateUser({ email, file: avatar })
      .then(res => {
        if (res.result === 'success') {
          getUser();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const addContact = (contact, extras) => {
    const { e, label, address, paymentID, entryID, edit, id } = contact;
    if (e) e.preventDefault();
    let message;
    Api.addContact(label, address, paymentID, entryID, edit)
      .then(res => {
        if (res.result === 'success') {
          getUser();
          extras.forEach(fn => fn());
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message, id }));
  };

  const deleteContact = contact => {
    const { entryID } = contact;
    let message;
    Api.deleteContact(entryID)
      .then(res => {
        if (res.result === 'success') {
          getUser();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const getQRCode = () => {
    let message;
    Api.getQRCode()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'UPDATE_QR_CODE', qrCodeUrl: res.message.qrCodeUrl });
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const check2FA = () => {
    let message;
    Api.check2FA()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: '2FA_CHECK', value: res.message.enabled });
          if (!res.message.enabled) getQRCode();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const update2FA = (options, extras) => {
    const { e, twoFACode, enable, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.update2FA(twoFACode, enable)
      .then(res => {
        if (res.result === 'success') {
          message = `QR Code ${enable ? 'enabled' : 'disabled'}.`;
          check2FA();
          extras.forEach(fn => fn());
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message, id }));
  };

  const getIPNConfig = address => {
    Api.getIPNConfig(address)
      .then(res => {
        dispatch({
          type: 'SET_IPN_CONFIG',
          ipn: res.result === 'success' ? res.message : {},
          address,
        });
      })
      .catch(e => console.error(e));
  };

  const getIPNClient = client => {
    Api.getIPNClient(client)
      .then(res =>
        res.result === 'success' && res.message[0] !== false &&
        dispatch({ type: 'UPDATE_IPN_CONFIG', ipn: res.message, client })
      )
      .catch(e => console.error(e));
  };

  const updateIPNConfig = options => {
    const { e, id, IPNWallet } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.updateIPNConfig(options)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'SET_IPN_CONFIG', ipn: res.message, address: IPNWallet })
        } else {
          message = res.message;
        }
      })
      .catch(e => console.error(e))
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message, id }));
  };

  const getWallets = () => {
    const { location } = props;
    let message;
    Api.getWallets()
      .then(res => {
        if (res.result === 'success') {
          const wallets = res.message.wallets;
          const currWallets = { ...updatedState.current.wallets };
          dispatch({ type: 'UPDATE_WALLETS', wallets });

          Object.keys(wallets).forEach(address => {
            if (currWallets[address] && currWallets[address].transactions.length < wallets[address].transactions.length) {
              const currentHashes = currWallets[address].transactions.map(ct => ct.hash);
              const newTx = wallets[address].transactions.filter(t => !currentHashes.includes(t.hash));
              newTx.forEach(tx => {
                showNotification({
                  message: <NewTxMessage tx={tx} />,
                  title: `NEW ${tx.type === 'received' ? 'INCOMING' : 'OUTGOING'} TRANSACTION`,
                  type: tx.type === 'received' ? 'success' : 'warning',
                  dismiss: { duration: 0, click: false, touch: false, showIcon: true },
                });
              });
            }
          });

          if (!location.pathname.startsWith('/pay/') && !location.pathname.startsWith('/payment/')) {
            Object.keys(wallets).forEach(address => {
              if (!updatedState.current.wallets[address].ipn) getIPNConfig(address);
            });
          }
        } else {
          message = res.message;
          if (Object.keys(updatedState.current.wallets).length > 0) {
            dispatch({ type: 'CLEAR_WALLETS' });
          }
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'WALLETS_LOADED' });
        dispatch({ type: 'APP_UPDATED' });
      });
  };

  const createWallet = () => {
    let message;
    Api.createWallet()
      .then(res => {
        if (res.result === 'success') {
          const address = res.message.wallet;
          dispatch({ type: 'CREATE_WALLET', address });
          getWallets();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const getWalletKeys = options => {
    const { e, address, code } = options;
    e.preventDefault();
    const { wallets } = state;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    if (!wallets[address].keys) {
      Api.getWalletKeys(address, code)
        .then(res => {
          if (res.result === 'success') {
            dispatch({ type: 'SET_WALLET_KEYS', keys: res.message, address });
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = err })
        .finally(() => {
          dispatch({ type: 'FORM_SUBMITTED', value: false });
          if (message) showNotification({ message: Array.isArray(message) ? message[0] : message });
        });
    }
  };

  const downloadWalletKeys = keys => {
    const element = document.createElement('a');
    const file = new Blob(
      [JSON.stringify(keys, null, 2)],
      { type: 'text/plain' },
    );
    element.href = URL.createObjectURL(file);
    element.download = 'conceal.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const deleteWallet = address => {
    Api.deleteWallet(address)
      .then(res => res.result === 'success' && dispatch({ type: 'DELETE_WALLET', address }))
      .catch(e => console.error(e))
      .finally(() => getWallets());
  };

  const importWallet = (options, extras) => {
    const { e, privateSpendKey, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.importWallet(privateSpendKey)
      .then(res => {
        if (res.result === 'success') {
          const address = res.message.wallet;
          if (!(address in updatedState.current.wallets)) {
            dispatch({type: 'CREATE_WALLET', address});
            getWallets();
            extras.forEach(fn => fn());
          }
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message, id });
      });
  };

  const sendTx = (options, extras) => {
    const { e, address, label, paymentID } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let sendTxResponse;
    Api.sendTx(options)
      .then(res => {
        if (res.result === 'error' || res.message.error) {
          showNotification({
            message: res.message.error ? res.message.error.message : res.message[0],
            title: 'ERROR SENDING CCX',
            type: 'danger',
            dismiss: { duration: 0, click: false, touch: false, showIcon: true },
          });
          return;
        }
        sendTxResponse = { redirect: res.message.redirect };
        dispatch({ type: 'SEND_TX', sendTxResponse });
        if (label && label !== '') addContact({ label, address, paymentID });
        extras.forEach(fn => fn());
        showNotification({
          message: <TxSentMessage tx={res.message.result} />,
          title: 'CCX SENT',
          type: 'success',
          dismiss: { duration: 0, click: false, touch: false, showIcon: true },
        });
        getWallets();
      })
      .catch(err => showNotification({
        message: `${err}`,
        title: 'ERROR SENDING CCX',
        type: 'danger',
        dismiss: { duration: 0, click: false, touch: false, showIcon: true },
      }))
      .finally(() => dispatch({ type: 'FORM_SUBMITTED', value: false }));
  };

  const getId = () => {
    Api.getId()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'SET_ID', id: res.message });
        }
      })
      .catch(e => console.error(e));
  };

  const checkId = id =>
    Api.checkId(id)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'SET_ID_CHECK', idAvailable: res.message[0] });
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: 'Error checking for ID.', id: 'idForm' });
        }
      })
      .catch(e => console.error(e));

  const createId = (options, extras) => {
    const { e, idAddress, idAddressToCreate, idName, idValue, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.createId({ address: idAddress, id: idValue, addressToCreate: idAddressToCreate || idAddress, name: idName })
      .then(res => {
        if (res.result === 'success') {
          getId();
        } else {
          message = res.message;
        }
        extras.forEach(fn => fn());
      })
      .catch(e => console.error(e))
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message, id });
      });
  };

  const deleteId = options => {
    const { id, address, name } = options;
    let { addressToCreate } = options;
    if (!addressToCreate || addressToCreate === '') addressToCreate = address;
    let message;
    Api.deleteId(id, address, addressToCreate, name)
      .then(res => {
        if (res.result === 'success') {
          getId();
        } else {
          message = res.message;
        }
      })
      .catch(e => console.error(e))
      .finally(() => {
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message, id: 'idForm' });
      });
  };

  const getMessages = () => {
    Api.getMessages()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'SET_MESSAGES', messages: res.message });
        }
      })
      .catch(err => console.error(err));
  };

  const sendMessage = (options, extras) => {
    const { e } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.sendMessage(options)
      .then(res => {
        let sendMessageResponse;
        if (res.result === 'error' || res.message.error) {
          sendMessageResponse = {
            status: 'error',
            message: `Error: ${res.message.error ? res.message.error.message : res.message}`,
          };
          dispatch({ type: 'SEND_MESSAGE', sendMessageResponse });
          return;
        }
        sendMessageResponse = {
          status: 'success',
          message: res.message.result,
          redirect: res.message.redirect,
        };
        dispatch({ type: 'SEND_MESSAGE', sendMessageResponse });
        extras.forEach(fn => fn());
        getMessages();
      })
      .catch(err => console.error(err))
      .finally(() => dispatch({ type: 'FORM_SUBMITTED', value: false }));
  };

  const getBlockchainHeight = () => {
    Api.getBlockchainHeight()
      .then(res => dispatch({ type: 'UPDATE_BLOCKCHAIN_HEIGHT', blockchainHeight: res.message.height }))
      .catch(e => console.error(e));
  };

  const getMarketPrices = () => {
    const { markets } = state;
    Object.keys(markets).forEach(market => {
      Api.getMarketPrices(markets[market].apiURL)
        .then(res => {
          dispatch({ type: 'UPDATE_MARKET', market, marketData: res })
        })
        .catch(e => console.error(e));
    });
  };

  const getPrices = () => {
    const { appSettings } = state;
    Api.getPrices(appSettings.coingeckoAPI)
      .then(res => dispatch({ type: 'UPDATE_PRICES', pricesData: res }))
      .catch(e => console.error(e));
  };

  const getMarketData = () => {
    Api.getMarketData()
      .then(res => dispatch({ type: 'UPDATE_MARKET_DATA', marketData: res }))
      .catch(e => console.error(e));
  };

  const actions = {
    loginUser,
    signUpUser,
    resetPassword,
    resetPasswordConfirm,
    logoutUser,
    getUser,
    updateUser,
    check2FA,
    update2FA,
    getQRCode,
    createWallet,
    getWallets,
    deleteWallet,
    importWallet,
    getWalletKeys,
    downloadWalletKeys,
    updateIPNConfig,
    getIPNClient,
    sendTx,
    getId,
    checkId,
    createId,
    deleteId,
    getMessages,
    sendMessage,
    getBlockchainHeight,
    getMarketPrices,
    getPrices,
    addContact,
    deleteContact,
    getMarketData,
  };

  const initApp = () => {
    const { location } = props;
    const { appSettings, userSettings } = state;

    getUser();
    getId();
    check2FA();
    getWallets();
    getMessages();
    getMarketData();

    const intervals = [];
    intervals.push(
      { fn: getId, time: userSettings.updateIdInterval },
      { fn: getWallets, time: userSettings.updateWalletsInterval },
      { fn: getMessages, time: userSettings.updateMessagesInterval },
      { fn: getMarketData, time: appSettings.updateMarketPricesInterval },
    );

    if (!location.pathname.startsWith('/payment/') && !location.pathname.startsWith('/pay/')) {
      getBlockchainHeight();
      getMarketPrices();
      getPrices();
      intervals.push(
        { fn: getBlockchainHeight, time: appSettings.updateBlockchainHeightInterval },
        { fn: getMarketPrices, time: appSettings.updateMarketPricesInterval },
        { fn: getPrices, time: appSettings.updateMarketPricesInterval },
      )
    }

    if (location.state && location.state.from.pathname.startsWith('/pay/')) {
      const params = new URLSearchParams(location.state.from.search);
      const client = params.get('client');
      if (client) getIPNClient(client);
    }

    if (location.pathname.startsWith('/pay/')) {
      const params = new URLSearchParams(props.location.search);
      const client = params.get('client');
      if (client) getIPNClient(client);
    }

    dispatch({ type: 'SET_INTERVALS', intervals });
  };

  const clearApp = () => {
    dispatch({ type: 'CLEAR_APP' });
    dispatch({ type: 'REDIRECT_TO_REFERRER', value: false });
  };

  const onRouteChanged = props => {
    const { location } = props;
    const isRedirect = props.history.action === 'REPLACE';
    if (location.pathname !== '/signup' && !location.pathname.startsWith('/reset_password') && (location.pathname === '/login' && !isRedirect)) {
      dispatch({ type: 'DISPLAY_MESSAGE', message: null });
    }
    if (location.pathname === '/login' && location.search === '?activated') {
      const message = (<>Account successfully activated.<br />Please log in.</>);
      dispatch({ type: 'DISPLAY_MESSAGE', message });
    }
  };

  useEffect(() => {
    if (state.user.loggedIn()) initApp();
    return () => clearApp();
  }, []);

  useEffect(() => onRouteChanged(props), [props.location]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default withRouter(AppContextProvider);
