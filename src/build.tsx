import { PaymentModal } from "./components/PaymentModal";
import * as useConfigHooks from "./hooks/useConfig";
import * as useEthereumHooks from "./hooks/useEthereum";
import * as useNotificationHooks from "./hooks/useNotification";
import * as usePaymentHooks from "./hooks/usePayment";
import * as useWalletsHooks from "./hooks/useWallets";
import HandleConfirmCredit from './components/ConfirmCredit';
import { loadSdkConfig } from './utils/load';
import React from "react";

const buildSDK = ({
  sdkPrivateKey,
  creditCardConfirmUrl,
  config,
}: {
  sdkPrivateKey: string;
  creditCardConfirmUrl: string;
  config: useConfigHooks.Config
}) => {
  return {
    ...usePaymentHooks,
    PaymentModal: (props: any) => (<PaymentModal
      onClose={props.onClose}
      paymentData={props.paymentData}
      sdkPrivateKey={sdkPrivateKey}
      creditCardConfirmUrl={creditCardConfirmUrl}
    />),
    PaymentProvider: ({ children }) => {
      const [isLoaded, setIsLoaded] = React.useState(false);

      React.useEffect(() => {
        loadSdkConfig(sdkPrivateKey).then(() => {
          setIsLoaded(true);
        }).catch((error) => {
          throw error;
        });
      }, []);

      return (isLoaded && <useConfigHooks.ConfigProvider config={config}>
        <useNotificationHooks.NotificationProvider>
          <useEthereumHooks.EthereumProvider>
            <useWalletsHooks.WalletsProvider>
              <usePaymentHooks.PaymentProvider
                sdkPrivateKey={sdkPrivateKey}
              >
                {children}
              </usePaymentHooks.PaymentProvider>
            </useWalletsHooks.WalletsProvider>
          </useEthereumHooks.EthereumProvider>
        </useNotificationHooks.NotificationProvider>
      </useConfigHooks.ConfigProvider>)
    },
    ...useConfigHooks,
    ...useEthereumHooks,
    ...useNotificationHooks,
    ...useWalletsHooks,
    HandleConfirmCredit: (props: any) => (<HandleConfirmCredit
      router={props.router}
      imageURL={props.imageURL}
      sdkPrivateKey={sdkPrivateKey}
    />),
  };
};

export default buildSDK;