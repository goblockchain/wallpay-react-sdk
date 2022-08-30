import { useRouter } from 'next/router';
import { usePayment } from '../hooks/usePayment'
import { useWallets } from '../hooks/useWallets'
import { useConfig } from '../hooks/useConfig'
import HandleConfirmCredit from './ConfirmCredit'

type BuyData = {
    unitPrice: number;
    amount: number;
    itemName: string;
    itemImage: string;
    transferParams: Object;
    hasFixedPrice: boolean;
    mintParams: Object;
    creditCardConfirmUrl: string;
}

type BuyButtonProps = {
    data: BuyData;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export const BuyButton = ({data, style, children = "WALLPAY PAYMENT"} : BuyButtonProps) => {
    const { config } = useConfig();
    const { onOpenPaymentModal } = usePayment();
    const { walletIsConnected, onOpenModal, walletAddress } =
      useWallets();
    const router = useRouter();
  
    const triggerLogin = () => {
      onOpenModal();
    };
  
    const triggerPayment = async () => {
      if (walletIsConnected) {
        onOpenPaymentModal(data);
      } else {
        triggerLogin();
      }
    };

    const styleButton = {
        fontSize: 24,
        backgroundColor: "#e3e3e3",
        padding: 16,
        borderRadius: 8,
        border: "none",
        fontWeight: "bold",
        ...style
      }

    return (
      <>
        <button
          onClick={triggerPayment}
          style={styleButton}
        >
          {children}
        </button>
        <HandleConfirmCredit
          router={router}
          imageURL={data.itemImage}
          sdkPrivateKey={config.sdkPrivateKey}
          creditCardConfirmUrl={config.creditCardConfirmUrl}
        />
      </>
    );
  };