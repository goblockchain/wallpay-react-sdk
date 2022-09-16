import React, { createContext, useContext, useState } from "react";

import { WalletProviders } from "./useWallets";

export type Config = {
  apiProvider: boolean;
  walletProviders: WalletProviders[];
  socialLogin: boolean;
  socialLoginVerifiers: ("google" | "facebook" | "reddit" | "discord" | "twitch" | "apple" | "github" | "linkedin" | "twitter" | "weibo" | "line" | "jwt" | "email_password" | "passwordless")[];
  title: string;
  networkType: "mainnet" | "testnet";
  blockchain: "ethereum" | "polygon";
  contractAddress: string;
  currency: "BRL" | "USD";
  mainColor: string;
  sdkPrivateKey: string;
  creditCardConfirmUrl: string;
};

export interface IConfigContext {
  config: Config;
}

type ConfigProviderProps = {
  children: React.ReactNode;
  config: Config;
};

const ConfigContext = createContext<IConfigContext>({} as IConfigContext);

export const ConfigProvider = ({ children, config }: ConfigProviderProps) => {
  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
