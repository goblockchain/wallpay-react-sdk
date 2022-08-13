import { PaymentModal } from "./components/PaymentModal";
import * as useConfigHooks from "./hooks/useConfig";
import * as useEthereumHooks from "./hooks/useEthereum";
import * as useNotificationHooks from "./hooks/useNotification";
import * as usePaymentHooks from "./hooks/usePayment";
import * as useStoreHooks from "./hooks/useStore";
import * as useWalletsHooks from "./hooks/useWallets";

// TODO: receive router here to avoid dependency of nextjs
const buildElements = (sdkPrivateKey: string) => {
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
  };
};

export default buildElements;