import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Text,
  Flex,
  Image,
  ChakraProvider,
} from "@chakra-ui/react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import closeblack from "../../assets/closeblack.png";
import { useTranslation } from "next-export-i18n";
import { useNotification } from "../../hooks/useNotification";
import { theme } from "../../styles/theme";

interface PaymentModalBodyProps {
  children: React.ReactNode;
  onClosePaymentModal: () => void;
  title?: string;
}

type PurchaseInfo = {
  amount: number;
  symbol: string;
  fiatAmount: number;
  currency: string;
  total?: number;
};

interface PaymentDetailsProps {
  paymentType: "credit" | "crypto";
  purchaseInfo: PurchaseInfo;
}

interface CheckoutFormProps {
  purchaseInfo: PurchaseInfo;
  termsIsChecked: boolean;
  checkFn: () => void;
  sdkPrivateKey: string;
  creditCardConfirmUrl?: string;
}

const PaymentDetailsInfo = ({
  amount,
  currency,
  fiatAmount,
  symbol,
}: PurchaseInfo) => (
  <Box>
    <Text fontWeight="400" color="#a19d9d" fontFamily="'Roboto', sans-serif">
      {amount} {symbol}
    </Text>
    {/* <Text fontWeight="400">
      {fiatAmount} {currency}
    </Text> */}
  </Box>
);

export const PaymentModalBody = ({ children, onClosePaymentModal, title, }: PaymentModalBodyProps) => {

  const { t } = useTranslation();

  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        borderRadius="15px"
        fontSize="20px"
        textAlign="center"
        fontWeight="bold"
        p="38px 50px"
      >
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Text fontSize="22px" color="#454545" fontFamily="'Roboto', sans-serif">
            {" "}
            {title ? title : t("payment_title")}
          </Text>
          <Image
            cursor="pointer"
            src={closeblack}
            onClick={onClosePaymentModal}
          />
        </Flex>
        {children}
      </Flex>
    </ChakraProvider>
  );
};

export const PaymentDetails = ({
  paymentType,
  purchaseInfo,
}: PaymentDetailsProps) => {
  const { t } = useTranslation();
  const renderPaymentInfo = () => {

    if (paymentType === "credit") {
      return (
        <ChakraProvider resetCSS={false} theme={theme}>
          <PaymentDetailsInfo
            amount={purchaseInfo.fiatAmount}
            symbol={purchaseInfo.currency}
            fiatAmount={purchaseInfo.amount}
            currency={purchaseInfo.symbol}
          />
        </ChakraProvider>
      );
    }

    return (
      <ChakraProvider resetCSS={false} theme={theme}>
        <PaymentDetailsInfo
          amount={purchaseInfo.amount}
          symbol={purchaseInfo.symbol}
          fiatAmount={purchaseInfo.fiatAmount}
          currency={purchaseInfo.currency}
        />
      </ChakraProvider>
    );
  };

  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <Box mt="25px" fontSize="18px"
        lineHeight="21px"
        fontWeight="700"
        color="#454545"
      >
        <Flex w="100%" justifyContent="space-between">
          <Text>{t('total_value')}</Text>
          {renderPaymentInfo()}
        </Flex>
      </Box>
    </ChakraProvider>
  );
};


export const CheckoutForm = ({ purchaseInfo, creditCardConfirmUrl }: CheckoutFormProps) => {
  const { emitNotificationModal } = useNotification();
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: creditCardConfirmUrl || window.location.href,
      },
    });
    setIsLoading(false);
  };

  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
      </form>
      <Box mt="28px" h="1px" w="100%" bgColor="#DFDFDF" />
      <PaymentDetails paymentType="credit" purchaseInfo={purchaseInfo} />
      <Button w="100%" h="60px"
        bg="#454545" mt="29px"
        borderRadius="45px"
        type="submit"
        isLoading={isLoading}
        color="#FFFFFF"
        _hover={{ bg: "#454545" }}
        form="payment-form"
        fontSize="20px"
        lineHeight="23px"
        fontWeight="400"
      >
        {t('continue')}
      </Button>
    </ChakraProvider>
  );
};

