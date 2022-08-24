import React from 'react'
import { ChakraProvider, IconButton, IconButtonProps } from '@chakra-ui/react'

import { XIcon } from './Icons/XIcon'
import { theme } from '../styles/theme';

interface CloseButtonProps {
  closeFn: () => void;
  color?: string
}

export const CloseButton = ({ closeFn, color, ...rest }: CloseButtonProps & Partial<IconButtonProps>) => {
  return (
    <ChakraProvider resetCSS={false} theme={theme}>
      <IconButton
        variant='unstyled'
        colorScheme=''
        aria-label='Close'
        isRound={true}
        icon={<XIcon boxSize={5} color={color} />}
        onClick={closeFn}
        {...rest}
      />
    </ChakraProvider>
  )
}
