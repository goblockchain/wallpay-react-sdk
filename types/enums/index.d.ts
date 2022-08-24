declare type ChainIdInfo = {
    DECIMAL: number;
    HEX: string;
};
export declare type BlockchainInfo = {
    CHAIN_ID: ChainIdInfo;
    INFURA_URL: string;
    RPC_URL: string;
    EXPLORER: string;
    SYMBOL: string;
    BLOCKCHAIN: 'ethereum' | 'polygon';
    OPENSEA_URL: string;
    RARIBLE_URL: string;
};
declare type Networks = {
    MAINNET: BlockchainInfo[];
    TESTNET: BlockchainInfo[];
};
export declare const NETWORKS: Networks;
export declare const ERRORS: {
    WALLETS: {
        WRONG_NETWORK: {
            CODE: number;
            MESSAGE: string;
            TYPE: string;
        };
    };
    METAMASK: {
        INSTALLATION: {
            CODE: number;
            MESSAGE: string;
            TYPE: string;
        };
        CONNECTION: {
            CODE: number;
            MESSAGE: string;
            TYPE: string;
        };
    };
    WALLET_CONNECT: {
        MODAL_CLOSE: {
            CODE: number;
            TYPE: string;
        };
    };
    TORUS: {
        MODAL_CLOSE: {
            CODE: number;
            TYPE: string;
        };
    };
};
export declare const PAYMENT_STEPS: {
    IN_PROGRESS: string;
    SUCCESS: string;
    TIMEOUT: string;
    PROCESSING: string;
};
export declare const EMAIL_STATUS: {
    SUCCESS: string;
};
export declare const WALLET_PROVIDERS: {
    METAMASK: string;
    WALLET_CONNECT: string;
    TORUS: string;
};
export {};
