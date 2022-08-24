import { PaymentModal } from "./components/PaymentModal";
import * as useConfigHooks from "./hooks/useConfig";
import * as useEthereumHooks from "./hooks/useEthereum";
import * as useNotificationHooks from "./hooks/useNotification";
import * as usePaymentHooks from "./hooks/usePayment";
import * as useWalletsHooks from "./hooks/useWallets";
import HandleConfirmCredit from "./components/ConfirmCredit";
import { loadSdkConfig, sdkConfig } from "./utils/load";
import { Config } from "./hooks/useConfig";
import React from "react";

const buildSDK = ({
  sdkPrivateKey,
  creditCardConfirmUrl,
  showUserSpace = false,
  userSpaceUrl,
}: {
  sdkPrivateKey: string;
  creditCardConfirmUrl?: string;
  showUserSpace?: boolean;
  userSpaceUrl?: string;
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

      React.useEffect(() => {
        loadSdkConfig(sdkPrivateKey)
          .then(() => {
            setIsLoaded(true);
          })
          .catch((error) => {
            throw error;
          });
      }, []);

      return (
        isLoaded && (
          <useConfigHooks.ConfigProvider config={sdkConfig.config as Config}>
            <useNotificationHooks.NotificationProvider showUserSpace={showUserSpace} userSpaceUrl={userSpaceUrl}>
              <useEthereumHooks.EthereumProvider sdkPrivateKey={sdkPrivateKey}>
                <useWalletsHooks.WalletsProvider sdkPrivateKey={sdkPrivateKey}>
                  <usePaymentHooks.PaymentProvider
                    creditCardConfirmUrl={creditCardConfirmUrl}
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
