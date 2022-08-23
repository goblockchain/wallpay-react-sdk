import axios from "axios";
import { WALLPAY_API_URL } from "../config";
import { Config } from "../hooks/useConfig";

export const sdkConfig = {} as Partial<{
  config: Config;
  paymentMethods: string[];
  stripeParams: {
    clientAccountId: string;
    goPublicKey: string;
  }
}>;

const validateKey = async (sdkPrivateKey: string) => {
  try {
    const { data: validateKeyData } = await axios.post(`${WALLPAY_API_URL}/keys/validateKey`, {
      clientKey: sdkPrivateKey,
    }, {
      headers: {
        authorization: sdkPrivateKey,
      }
    });

    return validateKeyData.data;
  } catch (error) {
    console.error('SDK Error while validating keys', error);
    throw new Error('Invalid Wallpay SDK keys provided');
  }
};

const getStripeParams = async (sdkPrivateKey: string) => {
  try {
    const {
      data: { stripeParams },
    } = await axios.get(`${WALLPAY_API_URL}/payments/credit_card/getStripeParams`, {
      headers: {
        authorization: sdkPrivateKey,
      }
    });

    return {
      clientAccountId: stripeParams.clientAccountId,
      goPublicKey: stripeParams.goPublicKey,
    };
  } catch (error) {
    console.error('SDK Error while retireving stripe params', error);
    throw new Error('Invalid stripe params');
  }
};

export const loadSdkConfig = async (sdkPrivateKey: string) => {
  const { paymentMethods } = await validateKey(sdkPrivateKey);
  const stripeParams = await getStripeParams(sdkPrivateKey);

  sdkConfig.config = <Config>{};
  sdkConfig.paymentMethods = paymentMethods;
  sdkConfig.stripeParams = stripeParams;
};