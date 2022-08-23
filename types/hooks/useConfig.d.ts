import React from "react";
import { LOGIN_TYPE } from "@toruslabs/torus-embed";
import { WalletProviders } from "./useWallets";
declare type Config = {
  apiProvider: boolean;
  walletProviders: WalletProviders[];
  socialLogin: boolean;
  socialLoginVerifiers: LOGIN_TYPE[];
  title: string;
  networkType: "mainnet" | "testnet";
  blockchain: "ethereum" | "polygon";
  contractAddress: string;
  erc1155contractAddress: string;
  currency: "BRL" | "USD";
  walletAddressCreator: string;
  mainColor: string;
};
interface IConfigContext {
  config: Config;
}
declare type ConfigProviderProps = {
  children: React.ReactNode;
  config: Config;
};
export declare const ConfigProvider: ({
  children,
  config,
}: ConfigProviderProps) => JSX.Element;
export declare const useConfig: () => IConfigContext;
export {};
