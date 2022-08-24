/// <reference types="react" />
interface ConnectWalletsModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleWalletConnect: (provider: any) => Promise<void>;
    isLoading?: boolean;
}
export declare const ConnectWalletsModal: ({ isOpen, onClose, handleWalletConnect, isLoading, }: ConnectWalletsModalProps) => JSX.Element;
export {};
