import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  ChakraProvider,
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { PaymentModal } from "../components/PaymentModal";
import { theme } from "../styles/theme";
import { cryptoCompare } from "../utils/api";
import { useEthereum } from "./useEthereum";
import { useConfig } from "./useConfig";

type PaymentDataProps = {
  itemName: any;
  tokenId: number;
  unitPrice: number;
  itemImage: string;
  amount: number;
  hasFixedPrice: boolean;
  walletAddress?: string;
};

type PaymentData = {
  itemName: any;
  tokenId: number;
  unitPrice: number;
  itemImage: string;
  amount: number;
  hasFixedPrice: boolean;
  walletAddress?: string;
  fiatUnitPrice: number;
};

type OnOpenPaymentModal = (paymentData: PaymentDataProps) => void;
export interface IPaymentContext {
  onOpenPaymentModal: OnOpenPaymentModal;
  onClosePaymentModal: () => void;
  isPaymentModalOpen: boolean;
}

const PaymentContext = createContext<IPaymentContext>({} as IPaymentContext);

export const PaymentProvider = ({
  children,
  sdkPrivateKey,
  creditCardConfirmUrl,
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData>(
    {} as PaymentData
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fiatRates } = useEthereum();
  const { config } = useConfig();

  const onOpenPaymentModal: OnOpenPaymentModal = async (paymentData) => {

    const fiatUnitPrice = parseInt(
      new BigNumber(paymentData.unitPrice)
        .multipliedBy(fiatRates[config.currency])
        .multipliedBy(100)
        .toFixed(0)
    );

    setPaymentData({ ...paymentData, fiatUnitPrice });
    onOpen();
  };

  return (
    <PaymentContext.Provider
      value={{
        onOpenPaymentModal,
        onClosePaymentModal: onClose,
        isPaymentModalOpen: isOpen,
      }}
    >
      {children}
      <ChakraProvider resetCSS={false} theme={theme}>
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent borderRadius="15px" maxWidth="507px" mx="20px">
            <ModalBody p="0px" m="0px">
              <PaymentModal
                onClose={onClose}
                paymentData={{
                  unitPrice: Number(paymentData.unitPrice),
                  tokenId: Number(paymentData.tokenId),
                  itemName: paymentData.itemName,
                  itemImage: String(paymentData.itemImage),
                  amount: paymentData.amount,
                  hasFixedPrice: paymentData.hasFixedPrice,
                  walletAddress: paymentData.walletAddress,
                  fiatUnitPrice: paymentData.fiatUnitPrice,
                }}
                sdkPrivateKey={sdkPrivateKey}
                creditCardConfirmUrl={creditCardConfirmUrl}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentModal must be used within a PaymentProvider");
  }
  return context;
};
