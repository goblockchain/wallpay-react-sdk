import React, { useState } from "react";
import {
  Image as ChakraImage,
  Text,
  Box,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverCloseButton,
  Portal,
  Center,
  Image,
  Button,
  useClipboard,
  Button as ChakraButton,
  PopoverArrow,
  IconButton,
  Tooltip,
  border,
  ChakraProvider,
} from "@chakra-ui/react";

import { useRouter } from "next/router";

// import { useWallets, useConfig } from "../../hooks";
import { useTranslation, useLanguageQuery } from "next-export-i18n";

// import { CopyToClipboard } from "..";
import { BlockchainInfo, NETWORKS } from "../../enums";
import { FiLogOut, FiUser } from "react-icons/fi";
import Link from 'next/link'

import metamaskWallet from "../../assets/metamask.png";
import walletConnectWallet from "../../assets/walletconnect-wallet.png";
import googleWallet from "../../assets/google-wallet.png";
import facebookWallet from "../../assets/facebook-wallet.png";
import torusWallet from "../../assets/torus-wallet.png";
import ethWallet from "../../assets/eth-wallet.png";
import polygonWallet from "../../assets/polygon-wallet.png";
import { theme } from "../../styles/theme";
import { useWallets } from "../../hooks/useWallets";
import { useConfig } from "../../hooks/useConfig";
import { CopyToClipboard } from "../CopyToClipboard";

const walletProvidersImageSrc = {
  metamask: metamaskWallet.src,
  ["wallet-connect"]: walletConnectWallet.src,
};

const socialLoginVerifierImageSrc = {
  google: googleWallet.src,
  facebook: facebookWallet.src,
  passwordless: torusWallet.src,
};

const blockchainIcons = {
  ethereum: ethWallet.src,
  polygon: polygonWallet.src,
};

export const ConnectBodyMetaMask = () => {
  const {
    walletAddress,
    walletBalance,
    disconnectWallet,
    walletProvider,
    socialLoginVerifier,
  } = useWallets();

  const { config } = useConfig();
  const { t } = useTranslation()
  const [query] = useLanguageQuery();

  const { onCopy } = useClipboard(walletAddress);
  const router = useRouter();
  const [blockchainInfo] = useState(() => {
    let info: BlockchainInfo;
    if (config.networkType === "mainnet") {
      info = NETWORKS.MAINNET.find(
        (info) => info.BLOCKCHAIN === config.blockchain
      ) as BlockchainInfo;
    } else {
      info = NETWORKS.TESTNET.find(
        (info) => info.BLOCKCHAIN === config.blockchain
      ) as BlockchainInfo;
    }
    return info;
  });

  const handleDisconnectMetamask = async () => {
    //setHasStoreNFTpurchased(false);
    //setPurchased(undefined);
    router.push("/");
    disconnectWallet();
    setTimeout(() => {
      router.reload();
    }, 2000);
  };

  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button
            p={{ base: "0px 28px", md: "0px 38px" }}
            _hover={{ transform: 'translateY(0px)' }}
            bg="0"
            h={{ base: "50px", md: "60px" }}
            w={{ base: '185px', md: 'auto' }}
            justifyContent="space-between"
          >
            <ChakraImage
              alt={walletProvider}
              src={String(socialLoginVerifier) !== '' ? socialLoginVerifierImageSrc[socialLoginVerifier] : walletProvidersImageSrc[walletProvider]}
              mr="10px" h="25px"
            />
            <Text fontSize="18px" fontWeight='700' lineHeight="21px" ml="5px" color="#FFFFFF" >
              {String(walletAddress).substring(0, 5) + '...' + String(walletAddress).substring(38)}
            </Text>
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            w={"20vw"}
            minW={"320px"}
            maxW={"400px"}
            mt="5px"
            p={"30px"}
            borderRadius="15px"
            bg="#FFF"
            border="0"
            fontFamily="roboto"
            boxShadow={"0px 6px 23px rgba(0, 0, 0, 0.15)"}
            _focus={{
              boxShadow: "0px 6px 23px rgba(0, 0, 0, 0.15)",
            }}
          >
            <PopoverHeader p="0px" border="none" flexDir="column">
              <Flex
                display={"flex"}
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Text
                  fontSize="22px"
                  lineHeight="24px"
                  fontWeight="400"
                  color="#454545"
                  textAlign="left"
                >
                  WallPay
                </Text>
                <PopoverCloseButton
                  position={"relative"}
                  display="flex"
                  pb={"20px"}
                  color="#454545"
                  alignItems="center"
                  size={"md"}
                  _focus={{ border: "none" }}
                  _hover={{ bg: "transparent" }}
                  _active={{ bg: "transparent" }}
                />
              </Flex>
            </PopoverHeader>
            <PopoverBody p="0px" w="100%" mb="40px">
              <Flex mt="32px" justifyContent="space-between">
                <Flex alignItems="center">
                  <Center
                    borderRadius="38px"
                    border="1px solid #DFDFDF"
                    p="15px 20px"
                  >
                    <ChakraImage
                      alt={walletProvider}
                      src={
                        String(socialLoginVerifier) !== ""
                          ? socialLoginVerifierImageSrc[socialLoginVerifier]
                          : walletProvidersImageSrc[walletProvider]
                      }
                    />
                    <Text
                      color="#717171"
                      ml="10px"
                      mt="2px"
                      fontSize="18px"
                      fontWeight="400"
                      lineHeight="21px"
                    >
                      {String(walletAddress).substring(0, 5) +
                        "..." +
                        String(walletAddress).substring(38)}
                    </Text>
                  </Center>
                  <Tooltip
                    hasArrow
                    label={t('copy_clipboard')}
                    shouldWrapChildren
                    bg="#454545"
                  >
                    <CopyToClipboard copyFn={onCopy} color="#009FE3" />
                  </Tooltip>
                </Flex>
                <Center>
                  <Tooltip
                    hasArrow
                    mr="10px"
                    label={t('user_area')}
                    shouldWrapChildren
                    bg={"#454545"}
                  > <Link href={{ pathname: '/userSpace', query: query }}>
                      <IconButton
                        mr="10px"
                        variant="outline"
                        colorScheme="whiteAlpha"
                        aria-label="User Space"
                        isRound={true}
                        icon={<FiUser size={"25px"} color="#454545" />}
                        border="none"
                        _hover={{
                          backgroundColor: "#f5f5f5",
                        }}
                        _focus={{
                          outline: "none",
                          backgroundColor: "#f5f5f5",
                        }}
                        _active={{
                          outline: "none",
                          backgroundColor: "#f5f5f5",
                        }}
                      />
                    </Link>
                  </Tooltip>
                </Center>
              </Flex>

              <Box borderTop="1px solid #DFDFDF" w="100%" mt={{ base: "32px" }} />
              <Box mt="26px">
                {/* <Text
                  fontSize="20px"
                  fontWeight="700"
                  lineHeight="23px"
                  color="#454545"
                  textAlign="center"
                >
                  {t('saldo')}
                </Text> */}
                <Tooltip
                  hasArrow
                  mr="10px"
                  label={blockchainInfo.BLOCKCHAIN}
                  shouldWrapChildren
                  bg={"#454545"}
                >
                  <Flex
                    w="100%"
                    mt="26px"
                    p="0px 25px"
                    alignItems="center"
                    border="solid 1px #DFDFDF"
                    borderRadius="10px"
                    h="60px"
                    justifyContent="space-between"
                  >
                    <Flex>
                      <Text fontSize="20px" fontWeight="light" color="#454545">
                        {walletBalance}
                      </Text>
                      <Text
                        ml="10px"
                        fontSize="20px"
                        fontWeight="medium"
                        color="#454545"
                      >
                        {blockchainInfo.SYMBOL}
                      </Text>
                    </Flex>
                    <Image src={blockchainIcons[blockchainInfo.BLOCKCHAIN]} />
                  </Flex>
                </Tooltip>
              </Box>
            </PopoverBody>
            <PopoverFooter bottom="0" w="100%" p="0" border="0">
              <Flex justifyContent="center">
                <Button
                  fontWeight="400"
                  fontSize="18px"
                  padding="16px 38px"
                  h="auto"
                  w="100%"
                  onClick={handleDisconnectMetamask}
                  lineHeight="22px"
                  fontFamily="Roboto"
                  textColor="#FFFFFF"
                  borderRadius="45px"
                  bg="#454545"
                  transition={"all 0.4s ease-in-out"}
                  _hover={{ bg: "#000000" }}
                  _active={{ bg: "#000000" }}
                  _focus={{ bg: "#000000" }}
                >
                  {t('disconect')}
                  <Box ml="10px">
                    <FiLogOut size={"20px"} color="#FFFFFF" />
                  </Box>
                </Button>
              </Flex>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    </ChakraProvider>
  );
};
