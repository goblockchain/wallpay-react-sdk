import React from 'react';
import Web3 from 'web3';
declare type EthFiatRates = {
    [key: string]: number;
};
interface IEthereumContext {
    infuraW3instance?: Web3;
    infuraContract?: any;
    setFiatRates: (fiatRates: EthFiatRates) => void;
    fiatRates: EthFiatRates;
}
export declare const EthereumContext: React.Context<IEthereumContext>;
export declare const EthereumProvider: ({ children }: {
    children: any;
}) => JSX.Element;
export declare const useEthereum: () => IEthereumContext;
export {};
