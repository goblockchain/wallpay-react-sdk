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