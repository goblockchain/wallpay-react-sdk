import { PaymentModal } from "./components/PaymentModal";
import * as useConfigHooks from "./hooks/useConfig";
import * as useEthereumHooks from "./hooks/useEthereum";
import * as useNotificationHooks from "./hooks/useNotification";
import * as usePaymentHooks from "./hooks/usePayment";
import * as useStoreHooks from "./hooks/useStore";
import * as useWalletsHooks from "./hooks/useWallets";
import HandleConfirmCredit from './components/ConfirmCredit';
import axios from "axios";

const validateKey = async (sdkPrivateKey: string) => {
  try {
    await axios.post('http://localhost:8001/keys/validateKey');
    return true;
  } catch (error) {
    console.error('Error validating keys', error);

    return false;
  }
};

// TODO: receive router here to avoid dependency of nextjs
const buildElements = async (sdkPrivateKey: string) => {
  const isKeyValid = await validateKey(sdkPrivateKey);

  if (!isKeyValid) throw new Error('Invalid Wallpay private key provided.');

  // TODO: verify how to pass along the private key
  return {
    ...usePaymentHooks,
    PaymentModal: (props: any) => (<PaymentModal
      onClose={props.onClose}
      paymentData={props.paymentData}
      sdkPrivateKey={sdkPrivateKey}
    />),
    PaymentProvider: ({ children }) => (<usePaymentHooks.PaymentProvider
      sdkPrivateKey={sdkPrivateKey}
    >{children}</usePaymentHooks.PaymentProvider>),
    ...useConfigHooks,
    ...useEthereumHooks,
    ...useNotificationHooks,
    ...useStoreHooks,
    ...useWalletsHooks,
    HandleConfirmCredit: (props: any) => (<HandleConfirmCredit
      router={props.router}
      sdkPrivateKey={sdkPrivateKey}
    />),
  };
};

export default buildElements;