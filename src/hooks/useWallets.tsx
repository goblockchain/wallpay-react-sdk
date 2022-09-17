import React, { createContext, useContext, useEffect, useState } from "react";
import { useDisclosure, ChakraProvider } from "@chakra-ui/react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { JsonRpcPayload, JsonRpcResponse } from "web3-core-helpers";
import { AbstractProvider } from "web3-core/types";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { ERRORS, WALLET_PROVIDERS, NETWORKS, BlockchainInfo, LoginType } from "../enums";
import { useNotification } from "./useNotification";
import { useConfig } from "./useConfig";
import { useRouter } from "next/router";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { sleep } from "../utils";
import { theme } from "../styles/theme";
import { ConnectWalletsModal } from "../components/ConnectEtherWallets";
import { sdkConfig } from "../utils/load";
import { t } from "../i18n";
import { Web3AuthCore } from "@web3auth/core";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

declare class WalletConnectWeb3Provider
  extends WalletConnectProvider
  implements AbstractProvider {
  sendAsync(
    payload: JsonRpcPayload,
    callback: (error: Error | null, result?: JsonRpcResponse) => void
  ): void;
}

export type WalletProviders = "metamask" | "wallet-connect" | "web3auth";
export type ConnectWalletInput = {
  provider: WalletProviders;
  loginType?: LoginType;
};
type ConnectWallet = (input: ConnectWalletInput) => Promise<void>;
type DisconnectWallet = () => Promise<void>;
type SetNewBalanceInput = { web3: Web3; address: string };
type SetNewBalance = (input: SetNewBalanceInput) => Promise<void>;
type GetProviderOptionsInput = {
  provider: WalletProviders;
  onCloseWalletModal?: () => void;
  loginType?: LoginType;
};
type GetProviderOptionsOutput = {
  web3?: Web3;
  address?: string;
  ethereumProvider?: WalletConnectProvider | any;
  web3AuthInstance?: OpenloginAdapter;
  error?: boolean;
  errorType?: string;
};
type GetProviderOptions = (
  input: GetProviderOptionsInput
) => Promise<GetProviderOptionsOutput>;
type GetBalanceInput = {
  web3: Web3;
  address: string;
};
type GetBalance = (input: GetBalanceInput) => Promise<string>;
type GetContractInput = {
  web3: Web3;
  abi: AbiItem[];
  contractAddress: string;
};
type GetContract = (input: GetContractInput) => Contract;
type GetNftsInput = {
  contract: Contract;
  address: string;
};
type GetNfts = (input: GetNftsInput) => Promise<void>;

export interface IWalletsContext {
  connectWallet: ConnectWallet;
  disconnectWallet: DisconnectWallet;
  setNewBalance: SetNewBalance;
  walletAddress: string;
  walletBalance: string;
  walletIsConnected: boolean;
  walletIsNotConnected: boolean;
  setWalletIsNotConnected: (boolean) => void;
  walletProvider: WalletProviders;
  web3AuthInstance: OpenloginAdapter;
  socialLoginVerifier: LoginType;
  goBlockchainContract: Contract;
  web3: Web3;
  onOpenModal: () => void;
  onCloseModal: () => void;
  isModalOpen: boolean;
}

export const WalletsContext = createContext<IWalletsContext>(
  {} as IWalletsContext
);
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export const WalletsProvider = ({ children, sdkPrivateKey }) => {
  const [walletIsConnected, setWalletIsConnected] = useState(false);
  const [walletIsNotConnected, setWalletIsNotConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [walletProvider, setWalletProvider] = useState<WalletProviders>(
    "" as WalletProviders
  );
  const [socialLoginVerifier, setSocialLoginVerifier] = useState<LoginType>(
    "" as LoginType
  );
  const [goBlockchainContract, setGoBlockchainContract] = useState<Contract>(
    {} as Contract
  );
  const [web3, setWeb3] = useState<Web3>({} as Web3);
  const [walletEthereumProvider, setWalletEthereumProvider] = useState<
    WalletConnectProvider | any
  >({} as WalletConnectProvider | any);
  const [web3AuthInstance, setweb3AuthInstance] = useState<OpenloginAdapter>({} as OpenloginAdapter);
  const [loadingWhenConnetWallet, setLoadingWhenConnetWallet] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { emitNotificationModal } = useNotification();
  const { config } = useConfig();
  const { asPath } = useRouter();

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if (walletIsConnected === true) onClose();
  }, [walletIsConnected]);

  const isValidChain = (chainId: number) => {
    let blockchain: BlockchainInfo = NETWORKS.TESTNET.find(
      (blockchainInfo) => blockchainInfo.CHAIN_ID.DECIMAL === chainId
    ) as BlockchainInfo;
    if (config.networkType === "mainnet") {
      blockchain = NETWORKS.MAINNET.find(
        (blockchainInfo) => blockchainInfo.CHAIN_ID.DECIMAL === chainId
      ) as BlockchainInfo;
    }
    return (
      blockchain !== undefined && blockchain.BLOCKCHAIN === config.blockchain
    );
  };

  const subscribeToEthereumProviderEvents = (
    provider: WalletConnectProvider | any
  ): void => {
    provider.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletAddress(accounts[0]);
      }
      setWalletIsNotConnected(true);
    });
    provider.on("chainChanged", (chainId: any) => {
      const parsedChainId =
        typeof chainId === "string" ? parseInt(chainId, 16) : chainId;
      if (!isValidChain(parsedChainId)) {
        emitNotificationModal({
          type: ERRORS.WALLETS.WRONG_NETWORK.TYPE,
          message: {
            primaryText: `${t("wrongNetworkPrimary")}`,
            secondaryText: `${t("wrongNetworkSecondaryInit")} ${capitalize(
              config.blockchain
            )} ${capitalize(config.networkType)}. ${t(
              "wrongNetworkSecondaryEnd"
            )}`,
          },
        });
      }
    });
    provider.on("disconnect", (_: any) => {
      disconnectWallet();
    });
  };

  const getNetworkName = (network: string, blockchain: string): string => {
    let networkName: string;
    if (network === "mainnet") {
      networkName = blockchain === "ethereum" ? "mainnet" : "matic";
    } else {
      networkName = blockchain === "ethereum" ? "rinkeby" : "mumbai";
    }
    return networkName;
  };

  const getProviderOptions: GetProviderOptions = async ({
    provider,
    onCloseWalletModal,
    loginType,
  }) => {
    let web3: Web3 = {} as Web3;
    let address: string = "0x";
    let ethereumProvider: WalletConnectProvider | any =
      {} as WalletConnectProvider;
    let web3AuthInstance: OpenloginAdapter = {} as OpenloginAdapter;
    try {
      switch (provider) {
        case WALLET_PROVIDERS.METAMASK:
          if (window.ethereum !== undefined) {
            setLoadingWhenConnetWallet(true);
            try {
              web3 = new Web3(window.ethereum as any);
              const metamaskReq = (await window.ethereum.request({
                method: "eth_requestAccounts",
              })) as any[];
              address = metamaskReq[0];
              ethereumProvider = window.ethereum;
            } catch (e) {
              console.log(e);
            }
            break;
          } else {
            throw { type: ERRORS.METAMASK.INSTALLATION.TYPE };
          }
        case WALLET_PROVIDERS.WALLET_CONNECT:
          try {
            const walletConnectProvider = new WalletConnectProvider({
              rpc: {
                1: "https://mainnet.infura.io/v3/0140c9b9de0345869bfaa2e5f010eb12",
                4: "https://rinkeby.infura.io/v3/0140c9b9de0345869bfaa2e5f010eb12",
                137: "https://polygon-mainnet.infura.io/v3/0140c9b9de0345869bfaa2e5f010eb12",
                80001:
                  "https://polygon-mumbai.infura.io/v3/0140c9b9de0345869bfaa2e5f010eb12",
              },
              chainId: 4,
            });
            if (onCloseWalletModal !== undefined) onCloseWalletModal();
            const [walletConnectAddress] = await walletConnectProvider.enable();
            address = walletConnectAddress;
            web3 = new Web3(walletConnectProvider as WalletConnectWeb3Provider);
            ethereumProvider = walletConnectProvider;
            break;
          } catch {
            throw { type: ERRORS.WALLET_CONNECT.MODAL_CLOSE.TYPE };
          }
        case WALLET_PROVIDERS.WEB3AUTH:
          try {
            const clientId = "BI2p2AxweCBOu3hVaTEw7BTeitIi9rpmOk9nX-qXEu-0K-0hkYUgkong_ozoRVx0Q3MXEGHEB1U0vhmN1qEDIYo";
            let blockchainInfo: BlockchainInfo;
            if (config.networkType === 'mainnet') {
              blockchainInfo = NETWORKS.MAINNET.find(blockchainInfo => blockchainInfo.BLOCKCHAIN === config.blockchain) as BlockchainInfo;
            } else {
              blockchainInfo = NETWORKS.TESTNET.find(blockchainInfo => blockchainInfo.BLOCKCHAIN === config.blockchain) as BlockchainInfo;
            }
            const web3auth = new Web3AuthCore({
              chainConfig: {
                displayName: String(sdkConfig.config?.blockchain),
                chainNamespace: CHAIN_NAMESPACES.EIP155,
                chainId: blockchainInfo.CHAIN_ID.HEX,
                rpcTarget: blockchainInfo.INFURA_URL,
                blockExplorer: blockchainInfo.EXPLORER,
                ticker: blockchainInfo.SYMBOL,
                tickerName: blockchainInfo.BLOCKCHAIN === 'ethereum' ? 'Ethereum' : 'Polygon',
              },
              clientId,
            });

            const openloginAdapter = new OpenloginAdapter({
              adapterSettings: {
                clientId,
                network: config.networkType,
                uxMode: "popup",
                storageKey: "session"
              }
            });

            openloginAdapter.setChainConfig({
              displayName: String(sdkConfig.config?.blockchain),
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: blockchainInfo.CHAIN_ID.HEX,
              rpcTarget: blockchainInfo.INFURA_URL,
              blockExplorer: blockchainInfo.EXPLORER,
              ticker: blockchainInfo.SYMBOL,
              tickerName: blockchainInfo.BLOCKCHAIN === 'ethereum' ? 'Ethereum' : 'Polygon',
            });
            await openloginAdapter.init({});
            web3auth.configureAdapter(openloginAdapter);

            web3AuthInstance = openloginAdapter;

            const connectedProvider = await web3auth.connectTo('openlogin', {
              loginProvider: loginType,
            });
            web3 = new Web3(connectedProvider as any);

            const walletAddress = (await web3.eth.getAccounts())[0];
            console.log('web3 walletAddress', walletAddress);

            ethereumProvider = connectedProvider;
            address = walletAddress;

            if (onCloseWalletModal !== undefined) onCloseWalletModal();

            break;
          } catch (error) {
            console.error('Error loading WEB3AUTH stuff', error);
            throw { type: ERRORS.WEB3AUTH.MODAL_CLOSE.TYPE };
          }
      }
      sessionStorage.setItem(
        "@gotokens/walletConnection",
        JSON.stringify({ provider, loginType })
      );
      return {
        web3,
        address,
        ethereumProvider,
        web3AuthInstance,
        error: false,
      };
    } catch (error: any) {
      if (provider === WALLET_PROVIDERS.WEB3AUTH) await web3AuthInstance.disconnect();
      return { error: true, errorType: error.type };
    }
  };

  const getBalance: GetBalance = async ({ web3, address }) => {
    const balance = await web3.eth.getBalance(address);
    const balanceFromWei = Web3.utils.fromWei(balance, "ether").slice(0, 6);
    return balanceFromWei;
  };
  const connectWallet: ConnectWallet = async ({ provider, loginType }) => {
    try {
      const {
        address,
        web3,
        ethereumProvider,
        web3AuthInstance,
        error,
        errorType,
      } = await getProviderOptions({
        provider,
        onCloseWalletModal:
          provider === WALLET_PROVIDERS.WALLET_CONNECT ||
            provider === WALLET_PROVIDERS.WEB3AUTH
            ? onClose
            : undefined,
        loginType,
      });
      if (error === true) throw { type: errorType };
      const chainId = await web3?.eth.getChainId();
      if (!isValidChain(Number(chainId))) {
        throw {
          type: ERRORS.WALLETS.WRONG_NETWORK.TYPE,
          message: {
            primaryText: `${t("wrongNetworkPrimary")}`,
            secondaryText: `${t("wrongNetworkSecondaryInit")} ${capitalize(
              config.blockchain
            )} ${capitalize(config.networkType)}. ${t(
              "wrongNetworkSecondaryEnd"
            )}`,
          },
          code: ERRORS.WALLETS.WRONG_NETWORK.CODE,
        };
      }
      const balance = await getBalance({
        web3: web3 as Web3,
        address: address as string,
      });

      const goBlockchainContract = new (web3 as Web3).eth.Contract(
        sdkConfig.contractData?.abi as AbiItem[],
        sdkConfig.contractData?.contractAddress as string
      );
      subscribeToEthereumProviderEvents(ethereumProvider);
      setWalletAddress(address as string);
      setWalletBalance(balance);
      setWalletProvider(provider);
      if (provider === WALLET_PROVIDERS.WEB3AUTH) {
        setweb3AuthInstance(web3AuthInstance as OpenloginAdapter);
        setSocialLoginVerifier(loginType as LoginType);
      }
      setGoBlockchainContract(goBlockchainContract);
      setWeb3(web3 as Web3);
      setWalletEthereumProvider(ethereumProvider);
      setWalletIsConnected(true);
      if (provider !== WALLET_PROVIDERS.WALLET_CONNECT) onClose();
    } catch (error: any) {
      console.log(error);
      if (
        error.type === ERRORS.WALLET_CONNECT.MODAL_CLOSE.TYPE ||
        error.type === ERRORS.WEB3AUTH.MODAL_CLOSE.TYPE
      ) {
        if (isOpen) onClose();
      } else {
        onClose();
        emitNotificationModal({
          type: error.type,
          message: {
            primaryText: `${t("wrongNetworkPrimary")}`,
            secondaryText:
              error.message !== undefined
                ? `${t("wrongNetworkSecondaryInit")} ${capitalize(
                  config.blockchain
                )} ${capitalize(config.networkType)}. ${t(
                  "wrongNetworkSecondaryEnd"
                )}`
                : undefined,
          },
        });
      }
    } finally {
      setLoadingWhenConnetWallet(false);
    }
  };

  const disconnectWallet = () => {
    sessionStorage.removeItem("@gotokens/walletConnection");
    setWalletEthereumProvider({} as WalletConnectProvider | any);
    setWalletAddress("");
    setWalletBalance("");
    setWalletIsConnected(false);
    setWalletProvider("" as WalletProviders);
    setWeb3({} as Web3);
  };

  const disconnectWalletFromModal: DisconnectWallet = async () => {
    if (walletProvider === WALLET_PROVIDERS.WALLET_CONNECT) {
      await walletEthereumProvider.disconnect();
    }
    if (walletProvider === WALLET_PROVIDERS.WEB3AUTH) {
      await web3AuthInstance.disconnect();
      setSocialLoginVerifier("" as LoginType);
    }
    disconnectWallet();
  };

  const setNewBalance: SetNewBalance = async ({ web3, address }) => {
    const newBalance = await getBalance({ web3, address });
    setWalletBalance(newBalance);
  };

  useEffect(() => {
    const reconnectWallet = async () => {
      const walletConnection = JSON.parse(
        sessionStorage.getItem("@gotokens/walletConnection") as string
      );
      if (walletConnection !== null) {
        if (walletConnection.provider === WALLET_PROVIDERS.METAMASK) {
          await sleep(2000);
        }
        connectWallet(walletConnection);
      }
    };
    reconnectWallet();
  }, []);

  return (
    <WalletsContext.Provider
      value={{
        connectWallet,
        disconnectWallet: disconnectWalletFromModal,
        setNewBalance,
        walletAddress,
        walletBalance,
        walletIsConnected,
        walletIsNotConnected,
        setWalletIsNotConnected,
        walletProvider,
        web3AuthInstance,
        socialLoginVerifier,
        goBlockchainContract,
        web3,
        isModalOpen: isOpen,
        onCloseModal: onClose,
        onOpenModal: onOpen,
      }}
    >
      {children}
      <ChakraProvider resetCSS={false} theme={theme}>
        <ConnectWalletsModal
          isOpen={isOpen}
          onClose={onClose}
          handleWalletConnect={connectWallet}
          isLoading={loadingWhenConnetWallet}
        />
      </ChakraProvider>
    </WalletsContext.Provider>
  );
};

export const useWallets = () => {
  const context = useContext(WalletsContext);
  if (!context) {
    throw new Error("useWallets must be used within a WalletsProvider");
  }
  return context;
};
