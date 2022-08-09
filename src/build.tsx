import { PaymentModal } from "./components/PaymentModal";
import { PaymentProvider } from "./hooks/usePayment";

// TODO: receive router here to avoid dependency of nextjs
const buildElements = (sdkPrivateKey: string) => {
  // TODO: verify how to pass along the private key
  return {
    PaymentModal: (props: any) => (<PaymentModal 
      onClose={props.onClose} 
      paymentData={props.paymentData} 
      sdkPrivateKey={sdkPrivateKey}
     />),
    PaymentProvider: (children: any) => (<PaymentProvider 
      sdkPrivateKey={sdkPrivateKey}
      children={children}
     />),
  };
};

export default buildElements;