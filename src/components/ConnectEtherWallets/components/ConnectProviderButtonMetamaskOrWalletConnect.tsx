import React, { useState } from 'react'
import {
  Image,
  Text,
  Button,
  Flex,
  Center,
  ChakraProvider
} from '@chakra-ui/react'
import { LOGIN_TYPE } from '@toruslabs/torus-embed';
import { t } from '../../../i18n';

import { ConnectWalletInput, WalletProviders } from '../../../hooks/useWallets';
import { theme } from '../../../styles/theme';
type ConnectProviderButtonProps = {
  handleWalletConnect: (provider: ConnectWalletInput) => Promise<void>
  walletProviderImageSrc: string
  walletProvider: WalletProviders
  loginType?: LOGIN_TYPE
}

export const ConnectProviderButtonMetamaskOrWalletConnect = ({
  handleWalletConnect,
  walletProviderImageSrc,
  walletProvider,
  loginType
}: ConnectProviderButtonProps) => {

  const walletProvidersNames = {
    metamask: 'Metamask',
    'wallet-connect': 'Wallet Connect',
    // google: 'Google',
    //facebook: 'Facebook',
    // twitter: 'Twitter',
    //  passwordless: 'E-mail'
  }

  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <Button p='17px, 38px'
        h='70px'
        w={{ base: "240px", md: "407px" }}
        bg="#FFFFFF"
        borderRadius="45px"
        border="1px solid #FFFFFF"
        onClick={() => handleWalletConnect({ provider: walletProvider, loginType })}
        boxShadow='0px 4px 12px rgba(0, 0, 0, 0.15)'
        mb='22px'
        _hover={{
          bg: "#FFFFFF",
        }}
      >
        <Center >
          <Image
            alt={walletProvider}
            src={walletProviderImageSrc}
            maxW="36px"
          />
          <Center flexWrap="wrap" textAlign="center">
            <Text ml="10px"
              fontFamily="'Roboto', sans-serif"
              fontSize="22px"
              fontWeight='400'
              color="#454545"
              lineHeight="26px"
            >
              {t("connect_with")}
            </Text>
            <Text ml="5px"
              fontFamily="'Roboto', sans-serif"
              fontSize="22px"
              fontWeight='400'
              color="#454545"
              lineHeight="26px"
            >
              {loginType !== undefined ? walletProvidersNames[loginType] : walletProvidersNames[walletProvider]}
            </Text>
          </Center>
        </Center>
      </Button>
    </ChakraProvider>
  )
}