type ChainIdInfo = {
  DECIMAL: number;
  HEX: string;
};
export type BlockchainInfo = {
  CHAIN_ID: ChainIdInfo;
  INFURA_URL: string;
  RPC_URL: string;
  EXPLORER: string;
  SYMBOL: string;
  BLOCKCHAIN: "ethereum" | "polygon";
  OPENSEA_URL: string;
  RARIBLE_URL: string;
};
type Networks = {
  MAINNET: BlockchainInfo[];
  TESTNET: BlockchainInfo[];
};

const OPENSEA_BASE_DOMAIN = "opensea.io";
const RARIBLE_BASE_DOMAIN = "rarible.com";

export const NETWORKS: Networks = {
  MAINNET: [
    {
      BLOCKCHAIN: "ethereum",
      CHAIN_ID: {
        DECIMAL: 1,
        HEX: "0x1",
      },
      EXPLORER: "https://etherscan.io",
      SYMBOL: "ETH",
      INFURA_URL:
        "https://mainnet.infura.io/v3/0140c9b9de0345869bfaa2e5f010eb12",
      RPC_URL: "https://mainnet.infura.io/v3/",
      OPENSEA_URL: `https://${OPENSEA_BASE_DOMAIN}/assets`,
      RARIBLE_URL: `https://${RARIBLE_BASE_DOMAIN}/token`,
    },
    {
      BLOCKCHAIN: "polygon",
      CHAIN_ID: {
        DECIMAL: 137,
        HEX: "0x89",
      },
      EXPLORER: "https://polygonscan.com",
      SYMBOL: "MATIC",
      INFURA_URL:
        "https://polygon-mainnet.infura.io/v3/0140c9b9de0345869bfaa2e5f010eb12",
      RPC_URL: "https://polygon-rpc.com/",
      OPENSEA_URL: `https://${OPENSEA_BASE_DOMAIN}/assets/matic`,
      RARIBLE_URL: `https://${RARIBLE_BASE_DOMAIN}/token/polygon`,
    },
  ],
  TESTNET: [
    {
      BLOCKCHAIN: "ethereum",
      CHAIN_ID: {
        DECIMAL: 4,
        HEX: "0x4",
      },
      EXPLORER: "https://rinkeby.etherscan.io",
      SYMBOL: "ETH",
      INFURA_URL:
        "https://rinkeby.infura.io/v3/71832579c9794b3a87dfdde1baedd8e7",
      RPC_URL: "https://rinkeby.infura.io/v3/",
      OPENSEA_URL: `https://testnets.${OPENSEA_BASE_DOMAIN}/assets`,
      RARIBLE_URL: `https://rinkeby.${RARIBLE_BASE_DOMAIN}/token`,
    },
    {
      BLOCKCHAIN: "polygon",
      CHAIN_ID: {
        DECIMAL: 80001,
        HEX: "0x13881",
      },
      EXPLORER: "https://etherscan.io",
      SYMBOL: "MATIC",
      INFURA_URL:
        "https://polygon-mumbai.infura.io/v3/71832579c9794b3a87dfdde1baedd8e7",
      RPC_URL: "https://rpc-mumbai.maticvigil.com/",
      OPENSEA_URL: `https://testnets.${OPENSEA_BASE_DOMAIN}/assets/mumbai`,
      RARIBLE_URL: `https://rinkeby.${RARIBLE_BASE_DOMAIN}/token/polygon`,
    },
  ],
};

export const ERRORS = {
  WALLETS: {
    WRONG_NETWORK: {
      CODE: 1001,
      MESSAGE: "Wrong Network connected",
      TYPE: "wallets.wrongNetwork",
    },
  },
  METAMASK: {
    INSTALLATION: {
      CODE: 1000,
      MESSAGE: "MetaMask App not installed",
      TYPE: "metamask.installation",
    },
    CONNECTION: {
      CODE: 1003,
      MESSAGE: "No connection with MetaMask Wallet",
      TYPE: "metamask.connection",
    },
  },
  WALLET_CONNECT: {
    MODAL_CLOSE: {
      CODE: 1004,
      TYPE: "walletConnect.modalClosed",
    },
  },
  WEB3AUTH: {
    MODAL_CLOSE: {
      CODE: 1005,
      TYPE: "torus.modalClosed",
    },
  },
};

export const PAYMENT_STEPS = {
  IN_PROGRESS: "payment.inProgress",
  SUCCESS: "payment.success",
  SUCCESS_NO_EMAIL: "payment.success_no_email",
  TIMEOUT: "payment.timeout",
  PROCESSING: "payment.processing",
  FAIL_TRANSFER: "payment.fail_transfer",
};

export const EMAIL_STATUS = {
  SUCCESS: "email.send.success",
};

export const WALLET_PROVIDERS = {
  METAMASK: "metamask",
  WALLET_CONNECT: "wallet-connect",
  WEB3AUTH: "web3auth",
};
