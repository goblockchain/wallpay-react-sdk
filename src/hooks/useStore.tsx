import React, { createContext, useContext, useState, useEffect } from "react";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";
import axios from "axios";
import { useEthereum } from "./useEthereum";
import { useNotification } from "./useNotification";
import { useConfig } from "./useConfig";
import { useWallets } from "./useWallets";
import { convertTimeStampToDateString } from "../utils";
// import fallback1 from '../../public/store/fallback/1.png'

type CallNFTs = (contractInstance: Contract) => Promise<SellOffer[]>;
type CallSellOffer = (
  contractInstance: Contract,
  tokenId: string
) => Promise<SellOfferNFT>;
type CallBalanceOf = (
  contractInstance: Contract,
  walletAddress: string,
  tokenId: string
) => Promise<number>;
type CallUserNfts = (
  contractInstance: Contract,
  walletAddress: string
) => Promise<SellOffer[]>;

type SellOfferNFT = {
  itemId: number;
  price: string;
  fiatPrice: string;
  createTime: number;
  name: string;
};

export type SellOffer = {
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

export interface IStoreContext {
  sellOffers: SellOffer[];
  setSellOffers: (sellOffers: SellOffer[]) => void;
  ownedNfts: any[];
  updateSellOffers: (contractInstance: any) => Promise<void>;
  updateUserNfts: () => Promise<void>;
  hasStoreNFTpurchased: boolean;
  setHasStoreNFTpurchased: (hasStoreNFTpurchased: boolean) => void;
}
const StoreContext = createContext<IStoreContext>({
  sellOffers: [],
  setSellOffers: () => { },
  ownedNfts: [],
  updateSellOffers: () => Promise.resolve(),
  updateUserNfts: () => Promise.resolve(),
  setHasStoreNFTpurchased: () => { },
  hasStoreNFTpurchased: false,
});

export const StoreProvider = ({ children }) => {
  console.log('children @ StoreProvider', children);
  const [sellOffers, setSellOffers] = useState([] as SellOffer[]);
  const { config } = useConfig();
  const [purchased, setPurchased] = useState(undefined);
  const [ownedNfts, setOwnedNfts] = useState([]);
  const { infuraContract, fiatRates } = useEthereum();
  const { walletIsConnected, walletAddress, goBlockchainContract } =
    useWallets();
  const { emitNotificationModal } = useNotification();
  const [hasStoreNFTpurchased, setHasStoreNFTpurchased] = useState(false);
  const idsList = ["1", "2"];

  async function updateSellOffers(contractInstance) {
    const data = await callNFTs(contractInstance);
    setSellOffers(data);
  }

  async function updateUserNfts() {
    const data = await callUserNfts(goBlockchainContract, walletAddress);
    setSellOffers(data);
  }

  function fixFiatPrice(id: string) {
    switch (id) {
      case "1":
        return 3600;
        break;
      case "2":
        return 550;
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (walletIsConnected) {
      const getData = async () => {
        try {
          await updateUserNfts();
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    } else {
      const getData = async () => {
        try {
          await updateSellOffers(infuraContract);
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }
  }, [walletIsConnected]);

  const getMetadata = async (baseURI: string, tokenId: string) => {
    const { data } = await axios.get(
      `https://goblockchain.mypinata.cloud/ipfs/${baseURI}/${tokenId}`
    );
    const imageCID = data.image.split("://")[1];
    return {
      id: tokenId,
      imageUri: `https://goblockchain.mypinata.cloud/ipfs/${imageCID}`,
      imageCID,
      baseURI,
      description: data.description,
      name: data.name,
      stats: data.stats,
    };
  };

  const callTokenUri = async (contractInstance: Contract): Promise<string> => {
    const uri = await contractInstance.methods.baseTokenURI().call();
    return uri.split("://")[1].split("/")[0];
  };

  const callBalanceOf: CallBalanceOf = async (
    contractInstance,
    walletAddress,
    tokenId
  ) => {
    return contractInstance.methods.balanceOf(walletAddress, tokenId).call();
  };

  const callSellOffers: CallSellOffer = async (contractInstance, tokenId) => {
    return contractInstance.methods.sellOffers(tokenId).call();
  };

  const callUserNfts: CallUserNfts = async (
    contractInstance,
    walletAddress
  ) => {
    let tempSellOffers: SellOffer[] = [];
    try {
      const baseTokenURI = await callTokenUri(contractInstance);
      let nftAmount = 0;
      let quantity = 0;
      for (let i = 0; i < idsList.length; i++) {
        nftAmount = await callBalanceOf(
          contractInstance,
          walletAddress,
          idsList[i]
        );
        quantity = await callBalanceOf(
          contractInstance,
          config.walletAddressCreator,
          idsList[i]
        );
        let sellOffer: SellOffer;
        const { imageUri, imageCID, description, name, stats } =
          await getMetadata(baseTokenURI, idsList[i]);
        const { price, createTime } = await callSellOffers(
          contractInstance,
          idsList[i]
        );

        let fixedPrice = fixFiatPrice(idsList[i]);

        sellOffer = {
          itemId: 0,
          tokenId: idsList[i],
          userQuantity: nftAmount,
          quantity: quantity,
          name: name,
          stats: stats,
          nftCover: "",
          baseURI: baseTokenURI,
          imageCID: imageCID,
          metadataCID: imageUri,
          purchased: nftAmount > 0 ? true : false,
          description: description,
          artistName: config.title,
          createdAt: convertTimeStampToDateString(createTime + ""),
          price: Web3.utils.fromWei(price, "ether"),
          originalPrice: price,
          /*
          Number(
            (
              Number(Web3.utils.fromWei(price, "ether")) *
              fiatRates[config.currency]
            ).toFixed(2)
          )
          */
          // Mudar esse fiatPrice depois para o que está acima
          fiatPrice: Number(fixedPrice)
        };
        tempSellOffers.push(sellOffer);
      }
    } catch (error) {
      console.log(error);
    }

    return tempSellOffers;
  };

  const callNFTs: CallNFTs = async (contractInstance) => {
    let tempSellOffers: SellOffer[] = [];
    try {
      const baseTokenURI = await callTokenUri(contractInstance);
      let nftAmount = 0;
      for (let i = 0; i < idsList.length; i++) {
        nftAmount = await callBalanceOf(
          contractInstance,
          config.walletAddressCreator,
          idsList[i]
        );
        let sellOffer: SellOffer;
        const { imageUri, imageCID, description, name, stats } =
          await getMetadata(baseTokenURI, idsList[i]);
        const { price, createTime } = await callSellOffers(
          contractInstance,
          idsList[i]
        );

        let fixedPrice = fixFiatPrice(idsList[i]);

        sellOffer = {
          itemId: 0,
          tokenId: idsList[i],
          quantity: nftAmount,
          name: name,
          stats: stats,
          nftCover: "",
          imageCID: imageCID,
          metadataCID: imageUri,
          baseURI: baseTokenURI,
          purchased: false,
          description: description,
          artistName: config.title,
          createdAt: convertTimeStampToDateString(createTime + ""),
          price: Web3.utils.fromWei(price, "ether"),
          originalPrice: price,
          /*
          fiatPrice: Number(
            (
              Number(Web3.utils.fromWei(price, "ether")) *
              fiatRates[config.currency]
            ).toFixed(2)
          ),
          */
          // Mudar esse fiatPrice depois para o que está acima
          fiatPrice: Number(fixedPrice)
        };
        tempSellOffers.push(sellOffer);
      }
    } catch (error) {
      console.log(error);
    }
    return tempSellOffers;
  };

  useEffect(() => {
    if (
      (config.apiProvider === true && fiatRates !== undefined) ||
      walletIsConnected
    ) {
      const getData = async () => {
        try {
          const sellOffers: SellOffer[] = await callNFTs(infuraContract);
          setSellOffers(sellOffers);
        } catch (error: any) {
          emitNotificationModal({
            type: error.message,
          });
        }
      };
      getData();
    }
  }, [fiatRates]);

  return (
    <StoreContext.Provider
      value={{
        sellOffers,
        setSellOffers,
        ownedNfts,
        updateSellOffers,
        updateUserNfts,
        hasStoreNFTpurchased,
        setHasStoreNFTpurchased,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
