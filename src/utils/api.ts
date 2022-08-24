import axios from "axios";
import { WALLPAY_API_URL } from "../config";

export const redeemToken = async (payload, sdkPrivateKey) => {
  try {
    return await axios.post(`${WALLPAY_API_URL}/payments/credit_card/confirm`, payload, {
      headers: {
        authorization: sdkPrivateKey,
      }
    });
  } catch (error) {
    console.log("redeemToken ERROR: ", error);
    return error;
  }
};

export const getContract = async (sdkPrivateKey) => {
  try {
    const axiosUrl = `${WALLPAY_API_URL}/payments/crypto/getContract/`;
    const axiosConfig = {
      headers: {
        authorization: sdkPrivateKey,
      },
    };
    const contractData = await axios.get(axiosUrl, axiosConfig);
    return contractData.data;
  } catch (error) {
    console.log("getContract ERROR: ", error);
    throw error;
  }
}

export const cryptoCompare = async (symbol, currency) => {
  
  return axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${currency}&api_key=${process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY}`)

}