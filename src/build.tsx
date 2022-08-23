import { PaymentModal } from "./components/PaymentModal";
import * as useConfigHooks from "./hooks/useConfig";
import * as useEthereumHooks from "./hooks/useEthereum";
import * as useNotificationHooks from "./hooks/useNotification";
import * as usePaymentHooks from "./hooks/usePayment";
import * as useStoreHooks from "./hooks/useStore";
import * as useWalletsHooks from "./hooks/useWallets";
import HandleConfirmCredit from './components/ConfirmCredit';
import axios from "axios";
import { sdkConfig, loadSdkConfig } from './utils/load';
import React from "react";

// TODO: receive router here to avoid dependency of nextjs
// const buildElements = async (sdkPrivateKey: string) => {
const buildSDK = ({
  sdkPrivateKey,
  creditCardConfirmUrl,
  config,
}: {
  sdkPrivateKey: string;
  creditCardConfirmUrl: string;
  config: useConfigHooks.Config
}) => {
  // const isKeyValid = await validateKey(sdkPrivateKey);

  // if (!isKeyValid) throw new Error('Invalid Wallpay private key provided.');

  return {
    ...usePaymentHooks,
    PaymentModal: (props: any) => (<PaymentModal
      onClose={props.onClose}
      paymentData={props.paymentData}
      sdkPrivateKey={sdkPrivateKey}
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
              <useStoreHooks.StoreProvider>
                <usePaymentHooks.PaymentProvider
                  sdkPrivateKey={sdkPrivateKey}
                >
                  {children}
                </usePaymentHooks.PaymentProvider>
              </useStoreHooks.StoreProvider>
            </useWalletsHooks.WalletsProvider>
          </useEthereumHooks.EthereumProvider>
        </useNotificationHooks.NotificationProvider>
      </useConfigHooks.ConfigProvider>)
    },
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

export default buildSDK;