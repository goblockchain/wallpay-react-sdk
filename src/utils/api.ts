import axios from "axios";
import { WALLPAY_API_URL } from "../config";
// const BASE_URL = 'https://raffleapi.financebit.co/api/v1';

export const redeemToken = async (payload, sdkPrivateKey) => {
  try {
    return await axios.post(`${WALLPAY_API_URL}/payments/credit_card/confirm`, payload, {
      headers: {
        'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string,
        authorization: sdkPrivateKey,
      }
    });
  } catch (error) {
    console.log("redeemToken ERROR: ", error);
    return error;
  }
};