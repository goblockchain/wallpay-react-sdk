/// <reference types="react" />
import { ConnectWalletInput, WalletProviders } from '../../../hooks/useWallets';
declare type ConnectProviderButtonProps = {
    handleWalletConnect: (provider: ConnectWalletInput) => Promise<void>;
    walletProviderImageSrc: string;
    walletProvider: WalletProviders;
    loginType?: "google" | "facebook" | "reddit" | "discord" | "twitch" | "apple" | "github" | "linkedin" | "twitter" | "weibo" | "line" | "jwt" | "email_password" | "passwordless";
};
export declare const ConnectProviderButton: ({ handleWalletConnect, walletProviderImageSrc, walletProvider, loginType }: ConnectProviderButtonProps) => JSX.Element;
export {};
