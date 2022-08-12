import React from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Torus, { LOGIN_TYPE } from "@toruslabs/torus-embed";
import { MetaMaskInpageProvider } from "@metamask/providers";
export declare type WalletProviders = "metamask" | "wallet-connect" | "torus";
export declare type ConnectWalletInput = {
    provider: WalletProviders;
    loginType?: LOGIN_TYPE;
};
declare type ConnectWallet = (input: ConnectWalletInput) => Promise<void>;
declare type DisconnectWallet = () => Promise<void>;
declare type SetNewBalanceInput = {
    web3: Web3;
    address: string;
};
declare type SetNewBalance = (input: SetNewBalanceInput) => Promise<void>;
interface IWalletsContext {
    connectWallet: ConnectWallet;
    disconnectWallet: DisconnectWallet;
    setNewBalance: SetNewBalance;
    walletAddress: string;
    walletBalance: string;
    walletIsConnected: boolean;
    walletProvider: WalletProviders;
    torusInstance: Torus;
    socialLoginVerifier: LOGIN_TYPE;
    goBlockchainContract: Contract;
    web3: Web3;
    onOpenModal: () => void;
    onCloseModal: () => void;
    isModalOpen: boolean;
}
export declare const WalletsContext: React.Context<IWalletsContext>;
declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider;
    }
}
export declare const WalletsProvider: ({ children }: {
    children: any;
}) => JSX.Element;
export declare const useWallets: () => IWalletsContext;
export {};
