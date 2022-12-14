import axios from "axios";
import { WALLPAY_API_URL } from "../config";
import { Config } from "../hooks/useConfig";
import { getContract } from "./api";

export const sdkConfig = {} as Partial<{
  config: Config;
  paymentMethods: string[];
  stripeParams: {
    // clientAccountId: string;
    clientPublicKey: string;
    // clientSecretKey: string;
    // goPublicKey: string;
  };
  contractData: {
    abi: any;
    contractAddress: string;
    payableMintOrTransferMethodName: any;
    payableMintOrTransferMethodParams: Object;
  };
}>;

const validateKey = async (sdkPrivateKey: string) => {
  try {
    const { data: validateKeyData } = await axios.post(
      `${WALLPAY_API_URL}/keys/validateKey`,
      {
        clientKey: sdkPrivateKey,
      },
      {
        headers: {
          authorization: sdkPrivateKey,
        },
      }
    );

    return validateKeyData.data;
  } catch (error) {
    console.error("SDK Error while validating keys", error);
    throw new Error("Invalid Wallpay SDK keys provided");
  }
};

const getStripeParams = async (sdkPrivateKey: string) => {
  try {
    const {
      data: { stripeParams },
    } = await axios.get(
      `${WALLPAY_API_URL}/payments/credit_card/getStripeParams`,
      {
        headers: {
          authorization: sdkPrivateKey,
        },
      }
    );

    return {
      // clientAccountId: stripeParams.clientAccountId,
      clientPublicKey: stripeParams.clientPublicKey,
      // clientSecretKey: stripeParams.clientSecretKey,
      // goPublicKey: stripeParams.goPublicKey,
    };
  } catch (error) {
    console.error("SDK Error while retireving stripe params", error);
    throw new Error("Invalid stripe params");
  }
};

export const loadSdkConfig = async (
  sdkPrivateKey: string,
  creditCardConfirmUrl?: string
) => {
  try {
    const storeInfo = await validateKey(sdkPrivateKey);
    const contractData = await getContract(sdkPrivateKey);

    const configParams: Config = {
      apiProvider: true,
      walletProviders: ["metamask"],
      socialLogin: true,
      socialLoginVerifiers: ["facebook", "google"],
      title: storeInfo.storeName,
      networkType: storeInfo.networkType,
      blockchain: storeInfo.network,
      contractAddress: storeInfo.smartContract,
      currency: "BRL",
      mainColor: "#454545",
      sdkPrivateKey,
      creditCardConfirmUrl: creditCardConfirmUrl || window.location.href,
    };

    sdkConfig.config = configParams;
    sdkConfig.paymentMethods = storeInfo.paymentMethods;

    if (storeInfo.paymentMethods.includes("credit_card")) {
      const stripeParams = await getStripeParams(sdkPrivateKey);
      sdkConfig.stripeParams = stripeParams;
    }
    sdkConfig.contractData = {
      abi: contractData.result.abi,
      contractAddress: contractData.contractAddress,
      payableMintOrTransferMethodName:
        contractData.result.payableMintOrTransferMethodName,
      payableMintOrTransferMethodParams:
        contractData.result.payableMintOrTransferMethodParams,
    };
  } catch (error) {
    console.error("Error loading SDK config", error);
  }
};
