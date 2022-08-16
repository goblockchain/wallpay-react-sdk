import React, { useState } from "react";
import {
  Button,
  Box,
  Text,
  Flex,
  Checkbox,
  Link,
  ButtonProps,
  Divider,
  Image,
  ChakraProvider,
} from "@chakra-ui/react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useStore } from "../../hooks/useStore";
import { useNotification } from "../../hooks/useNotification";
import closeblack from "../../assets/closeblack.png";
import { useTranslation } from "next-export-i18n";
import { theme } from "../../styles/theme";

interface PaymentStepsButtonProps extends ButtonProps {
  loading?: boolean;
}

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

interface PaymentTotalSectionProps {
  amount: number;
  symbol: string;
  checkFn: () => void;
}

interface CheckoutFormProps {
  purchaseInfo: PurchaseInfo;
  termsIsChecked: boolean;
  checkFn: () => void;
}

const PaymentDetailsInfo = ({
  amount,
  currency,
  fiatAmount,
  symbol,
}: PurchaseInfo) => (
  <Box>
    <Text fontWeight="400" color="#a19d9d">
      {amount} {symbol}
    </Text>
    {/* <Text fontWeight="400">
      {fiatAmount} {currency}
    </Text> */}
  </Box>
);

export const PaymentStepsButton = ({
  children,
  loading,
  ...rest
}: PaymentStepsButtonProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Button
        borderRadius="45px"
        border="1px solid #dfdfdf"
        bg="#fff"
        m="0 auto"
        height="38px"
        textAlign="center"
        width="104px"
        fontSize="14px"
        color="#454545"
        _hover={{ bg: "" }}
        {...rest}
      >
        {loading !== undefined && loading === true ? "Loading..." : children}
      </Button>
    </ChakraProvider>
  );
};

export const PaymentModalBody = ({
  children,
  onClosePaymentModal,
  title,
}: PaymentModalBodyProps) => {
  console.log('children @ PaymentModalBody', children);
  const { t } = useTranslation();

  return (
    <ChakraProvider theme={theme}>
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
          <Text fontSize="22px" color="#454545">
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
  const renderPaymentInfo = () => {
    if (paymentType === "credit") {
      return (
        <ChakraProvider theme={theme}>
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
      <ChakraProvider theme={theme}>
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
    <ChakraProvider theme={theme}>
      <Box
        mt="20px"
        mb="15px"
        textAlign="end"
        borderRadius="10px"
        background="#f4f4f4"
        p="19px 26px"
        fontSize="12px"
        fontWeight="normal"
      >
        <Flex w="100%" justifyContent="space-between">
          <Text fontWeight="400">Valor</Text>
          {renderPaymentInfo()}
        </Flex>
        {/* <Box mt="15px" w="100%" height="1px" background="#dfdfdf" /> */}
        {/* <Flex mt="15px" w="100%" justifyContent="space-between">
        <Text fontWeight="400" fontSize="10px">{t('tax')} GoTokens (10%)</Text>
        <Text fontWeight="400" color="#a19d9d" fontSize="10px">
          {Number(purchaseInfo.fiatAmount * 0.1).toFixed(2)} {purchaseInfo.currency}
        </Text>
      </Flex> */}
      </Box>
    </ChakraProvider>
  );
};

export const PaymentTotalSection = ({
  amount,
  symbol,
  checkFn,
}: PaymentTotalSectionProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Divider />
      <Flex mt="15px" w="100%" justifyContent="space-between">
        <Text fontSize="12px">pagamento total</Text>
        <Text fontWeight="400" fontSize="12px">
          {amount} {symbol}
        </Text>
      </Flex>

      <Flex mt="15px" mb="33px" w="100%" alignItems="flex-start">
        <Checkbox checked={false} onChange={checkFn} />
        <Text fontWeight="400" fontSize="12px" ml="10px">
          termos
          <Link isExternal={true} href="about:blank">
            <Text fontWeight="700" as="span">
              de serviço
            </Text>
          </Link>
        </Text>
      </Flex>
    </ChakraProvider>
  );
};

export const CheckoutForm = ({
  purchaseInfo,
  checkFn,
  termsIsChecked,
}: CheckoutFormProps) => {
  const { emitNotificationModal } = useNotification();
  const { sellOffers } = useStore();
  const stripe = useStripe();
  const elements = useElements();

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
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/conclusion`,
      },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
      emitNotificationModal({
        message: {
          secondaryText: error.message,
        },
      });
    } else {
      emitNotificationModal({});
    }
    setIsLoading(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
      </form>
      <PaymentDetails paymentType="credit" purchaseInfo={purchaseInfo} />
      <PaymentTotalSection
        amount={Number(purchaseInfo.total)}
        symbol={purchaseInfo.currency}
        checkFn={checkFn}
      />
      <PaymentStepsButton
        disabled={!termsIsChecked}
        id="submit"
        form="payment-form"
        type="submit"
        isLoading={isLoading}
      >
        completo
      </PaymentStepsButton>
    </ChakraProvider>
  );
};
