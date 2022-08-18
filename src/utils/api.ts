import axios from "axios";
// const BASE_URL = 'https://raffleapi.financebit.co/api/v1';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const checkParticipate = async (payload) => {
  try {
    await axios.post(`${BASE_URL}/register`, payload, {
      headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
    });
    return true;
  } catch (error) {
    console.log("checkParticipate ERROR: ", error);
    return false;
  }
};

export const registerRaffle = async (payload) => {
  try {
    return await axios.post(`${BASE_URL}/register/raffle`, payload, {
      headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
    });
  } catch (error) {
    console.log("registerRaffle ERROR: ", error);
    return error;
  }
};

export const redeemToken = async (payload) => {
  try {
    return await axios.post(`${BASE_URL}/payment/cc/confirm`, payload, {
      headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
    });
  } catch (error) {
    console.log("redeemToken ERROR: ", error);
    return error;
  }
};

export const listRaffles = async (payload) => {
  try {
    return await axios.get(`${BASE_URL}/register/${payload}`, {
      headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
    });
  } catch (error) {
    console.log("listRaffles ERROR: ", error);
    return error;
  }
};

export const checkUserEmailApi = async (wallet, token_id) => {
  return await axios.get(`${BASE_URL}/register/check?wallet=${wallet}&token_id=${token_id}`, {
    headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
  });
}

export const checkUserEmailApiMultipleIds = async (wallet, token_ids) => {
  return axios.post(`${BASE_URL}/register/checkIds`, {wallet, token_ids}, {
    headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
  });
}

export const authManager = async (payload) => {
  return await axios.post(`${BASE_URL}/manager/access`,{ token: payload, user_info: {} }, {
    headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
  });
}

export const getVault = async (payload) => {
  return await axios.get(`${BASE_URL}/manager/vault/${payload}`, {
    headers: {
      'x-access-token': localStorage.getItem('x-access-token') as string,
      'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string
    }
  });
};

export const confirmVault = async (payload) => {
  return await axios.post(
    `${BASE_URL}/manager/vault/`,
    { user_info: {}, ...payload },
    {
      headers: { 'x-access-token': localStorage.getItem('x-access-token') as string,
      'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string }
    }
  );
};

export const confirmAccess = async (payload) => {
  return await axios.post(`${BASE_URL}/manager/signature/validate/`, { user_info: {}, ...payload }, {
    headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
  });
}

export const checkAccess = async (payload) => {
  return await axios.get(`${BASE_URL}/manager/signature/check?token=${payload}`, {
    headers: {'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string}
  });
}

export const generateValidation = async () => {
  return await axios.get(`${BASE_URL}/manager/signature`,
    {
      headers: { 'x-access-token': localStorage.getItem('x-access-token') as string,
      'x-simple-access-token': process.env.NEXT_PUBLIC_API_AUTH_CODE as string }
    }
  );
}
