import React from 'react';
import { LOGIN_TYPE } from '@toruslabs/torus-embed';
import { WalletProviders } from './useWallets';
declare type Config = {
    apiProvider: boolean;
    walletProviders: WalletProviders[];
    socialLogin: boolean;
    socialLoginVerifiers: LOGIN_TYPE[];
    title: string;
    networkType: 'mainnet' | 'testnet';
    blockchain: 'ethereum' | 'polygon';
    contractAddress: string;
    erc1155contractAddress: string;
    currency: "BRL" | "USD";
    mainColor: string;
    secondaryColor: string;
    raffle: boolean;
    walletAddressCreator: string;
    website_url: string;
    twitter_url: string;
    facebook_url: string;
    instagram_url: string;
    youtube_url: string;
    telegram_url: string;
    GTMTrackinID: string;
};
interface IConfigContext {
    config: Config;
}
declare type ConfigProviderProps = {
    children: React.ReactNode;
    config: Config;
};
export declare const ConfigProvider: ({ children, config }: ConfigProviderProps) => JSX.Element;
export declare const useConfig: () => IConfigContext;
export {};
