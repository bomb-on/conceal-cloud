export const constants = {
  appVersion: process.env.REACT_APP_VERSION,
  appShortSha: process.env.REACT_APP_VERSION_SHORT_SHA,
  apiURL: process.env.REACT_APP_API_ENDPOINT,
  homePage: 'https://conceal.network',
  explorerURL: 'https://explorer.conceal.network',
  poolURL: 'https://pool.conceal.community',
  coingeckoAPI: 'https://api.coingecko.com/api/v3',
  discord: 'https://discord.conceal.network',
  twitter: 'https://twitter.com/ConcealNetwork',
  reddit: 'https://www.reddit.com/r/ConcealNetwork',
  telegram: 'https://t.me/concealnetworkusers',
  medium: 'https://medium.com/@ConcealNetwork',
  coinGecko: 'https://coingecko.com/en/coins/conceal',
  coinMarketCap: 'https://coinmarketcap.com/currencies/conceal',
  updateBlockchainHeightInterval: 30,  // seconds
  updateMarketPricesInterval: 120,  // seconds
  maxWallets: 3,
  coinDecimals: 6,
  coinDifficultyTarget: 120,  // seconds
  defaultFee: 0.001,
  messageFee: 0.001,
  selfDestructMessageFee: 0.001,
  // feePerChar: 0.001,
  depositFee: 0.011,
  investmentFee: 0.001,
  withdrawalFee: 0.001,
  idFee: 20,
  depositInterestRate: 0.2416,
  depositBlocksPerMonth: 21900,
  depositMinTerm: 1,  // months
  depositMaxTerm: 12,  // months
  messageLimit: 260,
  qrCodePrefix: 'conceal',
  donationURL: 'https://conceal.cloud/payment',
  IPNURL: 'https://conceal.cloud/pay',
};
