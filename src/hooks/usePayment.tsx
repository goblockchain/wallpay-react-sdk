import React, { createContext, useContext, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { PaymentModal } from "../components/PaymentModal";

type PaymentData = {
  fiatPrice?: number;
  price?: number;
  itemId?: number;
  tokenId?: number;
  itemName?: string;
  itemImage?: string;
};

type OnOpenPaymentModal = (paymentData: PaymentData) => void;
interface IPaymentContext {
  onOpenPaymentModal: OnOpenPaymentModal;
  onClosePaymentModal: () => void;
  isPaymentModalOpen: boolean;
}

const PaymentContext = createContext<IPaymentContext>({} as IPaymentContext);

export const PaymentProvider = ({ children, sdkPrivateKey }) => {
  console.log('PAYMENT PROVIDER KEY', sdkPrivateKey);
  const [paymentData, setPaymentData] = useState<PaymentData>(
    {} as PaymentData
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onOpenPaymentModal: OnOpenPaymentModal = (paymentData) => {
    setPaymentData(paymentData);
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
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} >
        <ModalOverlay />
        <ModalContent borderRadius="15px" maxWidth="507px" mx="20px">
          <ModalBody p="0px" m="0px">
            <PaymentModal
              onClose={onClose}
              paymentData={{
                PriceBRL: paymentData.fiatPrice,
                fixedPrice: paymentData.price,
                itemId: paymentData.itemId,
                tokenId: paymentData.tokenId,
                itemName: paymentData.itemName,
                itemImage: paymentData.itemImage,
              }}
              sdkPrivateKey={sdkPrivateKey}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
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