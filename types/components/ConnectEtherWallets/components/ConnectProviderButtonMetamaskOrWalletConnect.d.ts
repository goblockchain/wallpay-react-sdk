/// <reference types="react" />
import { LOGIN_TYPE } from '@toruslabs/torus-embed';
import { ConnectWalletInput, WalletProviders } from '../../../hooks/useWallets';
declare type ConnectProviderButtonProps = {
    handleWalletConnect: (provider: ConnectWalletInput) => Promise<void>;
    walletProviderImageSrc: string;
    walletProvider: WalletProviders;
    loginType?: LOGIN_TYPE;
};
export declare const ConnectProviderButtonMetamaskOrWalletConnect: ({ handleWalletConnect, walletProviderImageSrc, walletProvider, loginType }: ConnectProviderButtonProps) => JSX.Element;
export {};
