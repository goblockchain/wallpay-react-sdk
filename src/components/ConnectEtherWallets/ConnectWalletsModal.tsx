import React from "react";
import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  CircularProgress,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";

import { ConnectProviderButton } from "./components";
import { CloseButton } from "../CloseButton";
import { ConnectProviderButtonMetamaskOrWalletConnect } from "../ConnectEtherWallets/components/ConnectProviderButtonMetamaskOrWalletConnect";
import { useConfig } from "../../hooks/useConfig";
import { useTranslation } from "next-export-i18n";

import metamask from "../../assets/metamask.png";
import walletConnect from "../../assets/walletconnect.png";
import googleConnect from "../../assets/google.png";
import facebookConnect from "../../assets/facebook.png";
import twitterConnect from "../../assets/twitter.png";
import passwordlessConnect from "../../assets/passwordless.png";

const imageUrl = {
  metamask: metamask,
  "wallet-connect": walletConnect,
  google: googleConnect,
  facebook: facebookConnect,
  twitter: twitterConnect,
  passwordless: passwordlessConnect,
};

interface ConnectWalletsModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleWalletConnect: (provider: any) => Promise<void>;
  isLoading?: boolean;
}

export const ConnectWalletsModal = ({
  isOpen,
  onClose,
  handleWalletConnect,
  isLoading,
}: ConnectWalletsModalProps) => {
  const { config } = useConfig();
  const { t } = useTranslation();
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent
        fontFamily="Roboto"
        borderRadius="15px"
        maxWidth="600px"
        p="50px"
        alignItems="center"
        position="relative"
        className="modalOpaco"
        mx="20px"
      >
        {!isLoading ? (
          <>
            <CloseButton
              position="absolute"
              right="50px"
              closeFn={onClose}
              _focus={{ outline: "none" }}
              _hover={{ bg: "transparent" }}
            />
            <ModalHeader
              p="0"
              textAlign="center"
              fontSize="30px"
              fontWeight="700"
              lineHeight="64px"
              color="#454545"
              fontFamily="Roboto"
            >
              {t("Login")}
            </ModalHeader>
            <ModalBody p="0" mt="51px" w="100%" alignItems="center">
              <Text
                fontSize="22px"
                fontWeight="300"
                lineHeight="25px"
                textAlign="center"
                color="#454545"
              >
                {t("Login_about")}
              </Text>
              <SimpleGrid
                h="100%"
                w="100%"
                mt="71px"
                justifyItems="center"
                spacingX="22px"
                columns={{ sm: 1, md: 2, xl: 2 }}
              >
                {config.socialLogin === true &&
                  config.socialLoginVerifiers.map((verifier) => (
                    <ConnectProviderButton
                      key={verifier}
                      handleWalletConnect={handleWalletConnect}
                      walletProvider="torus"
                      loginType={verifier}
                      walletProviderImageSrc={imageUrl[verifier]}
                    />
                  ))}
              </SimpleGrid>

              <Center w="100%">
                <Box borderTop="1px solid #DFDFDF" w="100%" />
                <Text
                  ml="8px"
                  mr="8px"
                  color="#454545"
                  fontSize="22px"
                  fontWeight="300"
                  lineHeight="25px"
                >
                  {t("or")}
                </Text>
                <Box borderTop="1px solid #DFDFDF" w="100%" />
              </Center>

              <SimpleGrid
                h="100%"
                w="100%"
                mt="51px"
                justifyItems="center"
                spacingX="22px"
                columns={{ sm: 1, md: 1, xl: 1 }}
              >
                {config.walletProviders.map((provider) => (
                  <ConnectProviderButtonMetamaskOrWalletConnect
                    key={provider}
                    handleWalletConnect={handleWalletConnect}
                    walletProvider={provider}
                    walletProviderImageSrc={imageUrl[provider]}
                  />
                ))}
              </SimpleGrid>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalHeader
              p="0"
              textAlign="center"
              fontSize="30px"
              fontWeight="700"
              lineHeight="64px"
              color="#454545"
              fontFamily="Roboto"
            >
              {t("conectando")}
            </ModalHeader>
            <ModalBody
              p="0"
              mt="30px"
              w="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Text
                fontSize="22px"
                fontWeight="300"
                lineHeight="25px"
                textAlign="center"
                color="#454545"
                mb="41px"
                fontFamily="Roboto"
              >
                {t("aguardando_carteira_conectar")}
              </Text>
              <CircularProgress
                isIndeterminate
                value={30}
                size="150px"
                color={config.mainColor}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
