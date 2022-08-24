import axios from "axios";
import { WALLPAY_API_URL } from "../config";
import { Config } from "../hooks/useConfig";

export const sdkConfig = {} as Partial<{
  config: Config;
  paymentMethods: string[];
  stripeParams: {
    clientAccountId: string;
    goPublicKey: string;
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
      clientAccountId: stripeParams.clientAccountId,
      goPublicKey: stripeParams.goPublicKey,
    };
  } catch (error) {
    console.error("SDK Error while retireving stripe params", error);
    throw new Error("Invalid stripe params");
  }
};

export const loadSdkConfig = async (sdkPrivateKey: string) => {
  const storeInfo = await validateKey(sdkPrivateKey);
  const stripeParams = await getStripeParams(sdkPrivateKey);

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
  };

  sdkConfig.config = configParams;
  sdkConfig.paymentMethods = storeInfo.paymentMethods;
  sdkConfig.stripeParams = stripeParams;
  console.log("[DEBUG] Config params", sdkConfig);
  return sdkConfig;
};
