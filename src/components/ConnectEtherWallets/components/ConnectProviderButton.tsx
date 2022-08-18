import React, { useState } from 'react'
import {
  Image,
  Text,
  Button,
  Flex,
  ChakraProvider
} from '@chakra-ui/react'
import { LOGIN_TYPE } from '@toruslabs/torus-embed';

import { ConnectWalletInput, WalletProviders } from '../../../hooks/useWallets';
import { theme } from '../../../styles/theme';
type ConnectProviderButtonProps = {
  handleWalletConnect: (provider: ConnectWalletInput) => Promise<void>
  walletProviderImageSrc: string
  walletProvider: WalletProviders
  loginType?: LOGIN_TYPE
}

export const ConnectProviderButton = ({
  handleWalletConnect,
  walletProviderImageSrc,
  walletProvider,
  loginType
}: ConnectProviderButtonProps) => {
  const walletProvidersNames = {
    google: 'Google',
    facebook: 'Facebook',
    twitter: 'Twitter',
    passwordless: 'E-mail'
  }

  return (
    <ChakraProvider theme={theme}>
      <Button
        p='0'
        h='70px'
        w="239px"
        bg="#FFFFFF"
        borderRadius="15px"
        border="1px solid #dfdfdf"
        onClick={() => handleWalletConnect({ provider: walletProvider, loginType })}
        boxShadow='0px 4px 12px rgba(0, 0, 0, 0.15)'
        mb='41px'
        _hover={{ bg: "#FFFFFF", }}
      >
        <Flex
          width='100%'
          height='100%'
          alignItems='center'
          justifyContent='center'
        >
          <Image
            alt={walletProvider}
            src={walletProviderImageSrc}
            maxW="36px"
          />
          <Text ml="10px"
            fontFamily="Roboto"
            fontSize="20px"
            fontWeight='400'
            color="#454545"
            lineHeight="23px"
          >
            {loginType !== undefined ? walletProvidersNames[loginType] : walletProvidersNames[walletProvider]}
          </Text>
        </Flex>
      </Button>
    </ChakraProvider>
  )
}