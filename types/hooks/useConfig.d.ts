import React from "react";
import { WalletProviders } from "./useWallets";
declare type Config = {
  apiProvider: boolean;
  walletProviders: WalletProviders[];
  socialLogin: boolean;
  socialLoginVerifiers: "google" | "facebook" | "reddit" | "discord" | "twitch" | "apple" | "github" | "linkedin" | "twitter" | "weibo" | "line" | "jwt" | "email_password" | "passwordless"[];
  title: string;
  networkType: "mainnet" | "testnet";
  blockchain: "ethereum" | "polygon";
  contractAddress: string;
  currency: "BRL" | "USD";
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
