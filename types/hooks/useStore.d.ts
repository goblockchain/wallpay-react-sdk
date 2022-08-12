/// <reference types="react" />
export declare type SellOffer = {
    itemId: number;
    tokenId: string;
    name: string;
    nftCover: string;
    quantity: number;
    userQuantity?: number;
    imageCID: string;
    metadataCID: string;
    baseURI: string;
    purchased: boolean;
    description: string;
    artistName: string;
    stats: any[];
    createdAt: string;
    price: string;
    originalPrice: string;
    fiatPrice: number;
};
interface IStoreContext {
    sellOffers: SellOffer[];
    setSellOffers: (sellOffers: SellOffer[]) => void;
    ownedNfts: any[];
    updateSellOffers: (contractInstance: any) => Promise<void>;
    updateUserNfts: () => Promise<void>;
    hasStoreNFTpurchased: boolean;
    setHasStoreNFTpurchased: (hasStoreNFTpurchased: boolean) => void;
}
export declare const StoreProvider: ({ children }: {
    children: any;
}) => JSX.Element;
export declare const useStore: () => IStoreContext;
export {};
