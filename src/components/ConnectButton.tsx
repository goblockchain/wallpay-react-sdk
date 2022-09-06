import { Box, ChakraProvider } from '@chakra-ui/react';
import { useWallets } from '../hooks/useWallets';
import { theme } from '../styles/theme';
import { ConnectBodyMetaMask, ConnectEtherWalletsButton } from './ConnectEtherWallets';

export const ConnectButton = () => {
  const { onOpenModal, walletIsConnected } = useWallets()

  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <Box>
        {walletIsConnected === true ? (<ConnectBodyMetaMask />) : (<ConnectEtherWalletsButton handleOpenWalletModal={onOpenModal} />)}
      </Box>
    </ChakraProvider>
  )
};

