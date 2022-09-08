import { Box, ChakraProvider, ResponsiveValue } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { useWallets } from '../hooks/useWallets';
import { theme } from '../styles/theme';
import { ConnectBodyMetaMask, ConnectEtherWalletsButton } from './ConnectEtherWallets';

type ConnectButtonProps = {
  btnTextColor?: string;
  btnBackgroundColor?: string;
  btnBorderColor?: string;
  fixedButton?: boolean;
  sdkPrivateKey: string;
};

export const ConnectButton = ({
  btnTextColor,
  btnBackgroundColor,
  btnBorderColor,
  fixedButton = false,
  sdkPrivateKey,
}: ConnectButtonProps) => {
  const { onOpenModal, walletIsConnected } = useWallets()

  let CustomBox = ({ children }: { children: any }) => (<Box>{children}</Box>);

  if (fixedButton) {
    CustomBox = ({ children }: { children: any }) => (<Box style={{ left: 16, bottom: 16 }} pos="fixed">{children}</Box>);
  }

  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <CustomBox>
        {
          walletIsConnected === true ?
            (<ConnectBodyMetaMask
              sdkPrivateKey={sdkPrivateKey}
              btnTextColor={btnTextColor}
              btnBackgroundColor={btnBackgroundColor}
              btnBorderColor={btnBorderColor}
              fixedButton={fixedButton}
            />)
            : (
              <ConnectEtherWalletsButton
                handleOpenWalletModal={onOpenModal}
                btnTextColor={btnTextColor}
                btnBackgroundColor={btnBackgroundColor}
                btnBorderColor={btnBorderColor}
              />)
        }
      </CustomBox>
    </ChakraProvider>
  )
};

