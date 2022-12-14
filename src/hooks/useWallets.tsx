import React, { createContext, useContext, useEffect, useState } from "react";
import { useDisclosure, ChakraProvider } from "@chakra-ui/react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { JsonRpcPayload, JsonRpcResponse } from "web3-core-helpers";
import { AbstractProvider } from "web3-core/types";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import Torus, { LOGIN_TYPE, TorusLoginParams } from "@toruslabs/torus-embed";
import { ERRORS, WALLET_PROVIDERS, NETWORKS, BlockchainInfo } from "../enums";
import { useNotification } from "./useNotification";
import { useConfig } from "./useConfig";
import { useRouter } from "next/router";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { sleep } from "../utils";
import { theme } from "../styles/theme";
import { ConnectWalletsModal } from "../components/ConnectEtherWallets";
import { sdkConfig } from "../utils/load";
import { t } from "../i18n";

declare class WalletConnectWeb3Provider
  extends WalletConnectProvider
  implements AbstractProvider
{
  sendAsync(
    payload: JsonRpcPayload,
    callback: (error: Error | null, result?: JsonRpcResponse) => void
  ): void;
}

export type WalletProviders = "metamask" | "wallet-connect" | "torus";
export type ConnectWalletInput = {
  provider: WalletProviders;
  loginType?: LOGIN_TYPE;
};
type ConnectWallet = (input: ConnectWalletInput) => Promise<void>;
type DisconnectWallet = () => Promise<void>;
type SetNewBalanceInput = { web3: Web3; address: string };
type SetNewBalance = (input: SetNewBalanceInput) => Promise<void>;
type GetProviderOptionsInput = {
  provider: WalletProviders;
  onCloseWalletModal?: () => void;
  loginType?: LOGIN_TYPE;
};
type GetProviderOptionsOutput = {
  web3?: Web3;
  address?: string;
  ethereumProvider?: WalletConnectProvider | any;
  torusInstance?: Torus;
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
  torusInstance: Torus;
  socialLoginVerifier: LOGIN_TYPE;
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
  const [socialLoginVerifier, setSocialLoginVerifier] = useState<LOGIN_TYPE>(
    "" as LOGIN_TYPE
  );
  const [goBlockchainContract, setGoBlockchainContract] = useState<Contract>(
    {} as Contract
  );
  const [web3, setWeb3] = useState<Web3>({} as Web3);
  const [walletEthereumProvider, setWalletEthereumProvider] = useState<
    WalletConnectProvider | any
  >({} as WalletConnectProvider | any);
  const [torusInstance, setTorusInstance] = useState<Torus>({} as Torus);
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
    let address: string = "";
    let ethereumProvider: WalletConnectProvider | any =
      {} as WalletConnectProvider;
    let torusInstance: Torus = {} as Torus;
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
        case WALLET_PROVIDERS.TORUS:
          try {
            const TorusEmbed = (await import("@toruslabs/torus-embed")).default;
            const torus = new TorusEmbed({});
            await torus.init({
              buildEnv: "production",
              network: {
                host: getNetworkName(config.networkType, config.blockchain),
              },
            });
            torusInstance = torus;
            if (onCloseWalletModal !== undefined) onCloseWalletModal();
            const loginParams: TorusLoginParams = {};
            if (loginType !== undefined && loginType !== "passwordless")
              loginParams.verifier = loginType;
            const [torusAddress] = await torus.login(loginParams);
            const torusProvider = torus.provider;
            address = torusAddress;
            web3 = new Web3(torusProvider as AbstractProvider);
            ethereumProvider = torusProvider;
            break;
          } catch (error) {
            throw { type: ERRORS.TORUS.MODAL_CLOSE.TYPE };
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
        torusInstance,
        error: false,
      };
    } catch (error: any) {
      if (provider === WALLET_PROVIDERS.TORUS) await torusInstance.cleanUp();
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
        torusInstance,
        error,
        errorType,
      } = await getProviderOptions({
        provider,
        onCloseWalletModal:
          provider === WALLET_PROVIDERS.WALLET_CONNECT ||
          provider === WALLET_PROVIDERS.TORUS
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
      if (provider === WALLET_PROVIDERS.TORUS) {
        setTorusInstance(torusInstance as Torus);
        setSocialLoginVerifier(loginType as LOGIN_TYPE);
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
        error.type === ERRORS.TORUS.MODAL_CLOSE.TYPE
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
    if (walletProvider === WALLET_PROVIDERS.TORUS) {
      await torusInstance.cleanUp();
      setSocialLoginVerifier("" as LOGIN_TYPE);
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
        torusInstance,
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
