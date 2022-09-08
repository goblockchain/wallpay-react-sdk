import React from 'react'
import { Text, Button, ButtonProps, ChakraProvider } from '@chakra-ui/react'
import { WalletIcon } from '../Icons'
import { t } from "../../i18n";
import { theme } from '../../styles/theme';


type ConnectEtherWalletsButtonProps = {
  handleOpenWalletModal: () => void;
  btnTextColor?: string;
  btnBackgroundColor?: string;
  btnBorderColor?: string;
}

export const ConnectEtherWalletsButton = ({
  handleOpenWalletModal,
  btnTextColor = '#454545',
  btnBackgroundColor = '#FFFFFF',
}: ConnectEtherWalletsButtonProps & ButtonProps) => {
  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <Button p="0px 38px"
        _hover={{
          transform: 'translateY(0px)'
        }}
        bg={btnBackgroundColor}
        h={{ base: "50px", md: "60px" }}
        w={{ base: '185px', md: 'auto' }}
        onClick={handleOpenWalletModal}
        color={btnTextColor}
      >
        <Text color={btnTextColor}
          fontFamily="'Roboto', sans-serif"
          fontStyle='normal'
          fontSize='18px'
          fontWeight='700'
          lineHeight="21px"
        >  {t('connect_wallet')}
        </Text>
      </Button>
    </ChakraProvider>
  )
}