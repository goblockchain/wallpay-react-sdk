import React from 'react'
import { Text, Button, ButtonProps } from '@chakra-ui/react'
import { useTranslation } from "next-export-i18n";


type ConnectEtherWalletsButtonProps = {
  handleOpenWalletModal: () => void
}

export const ConnectEtherWalletsButton = ({ handleOpenWalletModal, ...rest }: ConnectEtherWalletsButtonProps & ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button p="0px 38px"
      _hover={{
        transform: 'translateY(0px)'
      }}
      // backdropFilter="blur(60px)"
      bg="0"
      h={{ base: "50px", md: "60px" }}
      w={{ base: '185px', md: 'auto' }}
      onClick={handleOpenWalletModal}
      {...rest}
    >
      <Text color="#FFFFFF"
        fontFamily='Roboto'
        fontStyle='normal'
        fontSize='18px'
        fontWeight='700'
        lineHeight="21px"
      >  {t('connect_wallet')}
      </Text>
    </Button>
  )
}