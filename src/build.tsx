import { PaymentModal } from "./components/PaymentModal";
import * as useConfigHooks from "./hooks/useConfig";
import * as useEthereumHooks from "./hooks/useEthereum";
import * as useNotificationHooks from "./hooks/useNotification";
import * as usePaymentHooks from "./hooks/usePayment";
import * as useWalletsHooks from "./hooks/useWallets";
import HandleConfirmCredit from "./components/ConfirmCredit";
import { loadSdkConfig } from "./utils/load";
import React from "react";

const buildSDK = ({
  sdkPrivateKey,
  creditCardConfirmUrl,
}: {
  sdkPrivateKey: string;
  creditCardConfirmUrl: string;
}) => {
  return {
    ...usePaymentHooks,
    PaymentModal: (props: any) => (
      <PaymentModal
        onClose={props.onClose}
        paymentData={props.paymentData}
        sdkPrivateKey={sdkPrivateKey}
        creditCardConfirmUrl={creditCardConfirmUrl}
      />
    ),
    PaymentProvider: ({ children }) => {
      const [isLoaded, setIsLoaded] = React.useState(false);
      const [storeConfig, setStoreConfig] = React.useState(
        {} as useConfigHooks.Config
      );

      React.useEffect(() => {
        loadSdkConfig(sdkPrivateKey)
          .then(({ config }) => {
            setIsLoaded(true);
            if (config) {
              setStoreConfig(config);
            }
          })
          .catch((error) => {
            throw error;
          });
      }, []);

      return (
        isLoaded &&
        storeConfig && (
          <useConfigHooks.ConfigProvider config={storeConfig}>
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
          </useConfigHooks.ConfigProvider>
        )
      );
    },
    ...useConfigHooks,
    ...useEthereumHooks,
    ...useNotificationHooks,
    ...useWalletsHooks,
    HandleConfirmCredit: (props: any) => (
      <HandleConfirmCredit
        router={props.router}
        imageURL={props.imageURL}
        sdkPrivateKey={sdkPrivateKey}
      />
    ),
  };
};

export default buildSDK;
