import React from "react";
import { Box, Flex, Text, Button as ChakraButton, ChakraProvider } from "@chakra-ui/react";
import { useTranslation } from "next-export-i18n";

import { CartIcon } from "../components/Icons";
import { FormatPrice } from "../utils";
import { theme } from "../styles/theme";

type BuyButtonProps = {
  isOverColor?: string;
  symbol?: string;
  currency?: string;
  fixedPrice?: number;
  currencyPrice?: string;
  purchased?: boolean;
  handlePaymentModal?: () => void;
  isOver?: boolean;
  setIsOver?: (isOver: boolean) => void;
  isToken3?: boolean
};

export const BuyButton = ({
  isOverColor,
  symbol,
  currency,
  fixedPrice,
  currencyPrice,
  purchased,
  handlePaymentModal,
  setIsOver,
  isOver,
  isToken3
}: BuyButtonProps) => {
  const purchasedLightTextColor = (purchased: boolean) =>
    purchased === true ? "#DFDFDF" : "#A19D9D";
  const purchasedDarkTextColor = (purchased: boolean) =>
    purchased === true ? "#DFDFDF" : "#454545";
  const purchasedMainBorderColor = (purchased: boolean) =>
    purchased === true ? "#DFDFDF" : "gray.100";

  const { t } = useTranslation();

  return (
    <ChakraProvider theme={theme}>
      <Flex
        alignItems="center"
        justifyContent="center"
        borderRadius="15px"
        border="1px solid"
        borderColor={purchasedMainBorderColor(Boolean(purchased))}
        w="fit-content"
        mr={{ base: "0px", md: "21px" }}
        boxShadow={"0px 6px 23px rgba(0, 0, 0, 0.15)"}
        p="20px 30px"
      >
        <Box>
          <Text
            fontFamily="Roboto"
            fontStyle="normal"
            fontWeight="300"
            fontSize="16px"
            lineHeight="19px"
            mb="7px"
            color={purchasedDarkTextColor(Boolean(purchased))}
          // color="#454545"
          >
            {t("fixed_price")}
          </Text>
          <Flex alignItems="center">
            <Text
              fontFamily="Roboto"
              fontStyle="normal"
              fontWeight="700"
              fontSize="16px"
              lineHeight="19px"
              color={purchasedDarkTextColor(Boolean(purchased))}
            //color='#454545'
            >
              <FormatPrice amount={fixedPrice} currency={symbol} />
            </Text>
            <Text
              fontFamily="Roboto"
              fontStyle="normal"
              fontWeight="700"
              fontSize="16px"
              lineHeight="19px"
              color={purchasedDarkTextColor(Boolean(purchased))}
              //color='#454545'
              ml="9px"
            >
              <FormatPrice amount={currencyPrice} currency={currency} />
            </Text>
          </Flex>
        </Box>
        <ChakraButton
          isDisabled={isToken3 || isOver}
          ml="25px"
          borderRadius="10px"
          border="1px solid #dfdfdf"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="0"
          _hover={{ borderColor: purchased ? "#dfdfdf" : isOverColor }}
          _focus={{ outline: 0 }}
          w="44px"
          h="44px"
          p="10px"
          onClick={handlePaymentModal}
        // onMouseOver={() => setIsOver(true)}
        // onMouseOut={() => setIsOver(false)}
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            h="100%"
            w="100%"
            mr="3px"
          >
            <CartIcon
              boxSize={5}
              color={
                isOver === true && purchased === false ? isOverColor : undefined
              }
            />
          </Flex>
        </ChakraButton>
      </Flex>
    </ChakraProvider>
  );
};
