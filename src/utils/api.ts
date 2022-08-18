import axios from "axios";
// const BASE_URL = 'https://raffleapi.financebit.co/api/v1';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const redeemToken = async (payload, sdkPrivateKey) => {
  try {
    return await axios.post(`${BASE_URL}/payments/credit_card/confirm`, payload, {
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