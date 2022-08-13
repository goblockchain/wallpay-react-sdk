import React from 'react'
import { ChakraProvider, IconButton } from '@chakra-ui/react'

import { ClipBoardIcon } from './Icons'
import { theme } from '../styles/theme';

interface CopyToClipboardProps {
  copyFn?: () => void;
  color?: string
}

export const CopyToClipboard = ({ copyFn, color }: CopyToClipboardProps) => {
  return (
    <ChakraProvider theme={theme}>
    <IconButton
      variant='outline'
      colorScheme='whiteAlpha'
      aria-label='Copy to clipboard'
      isRound={true}
      icon={<ClipBoardIcon boxSize={5} color={color} />}
      onClick={copyFn}
    />
    </ChakraProvider>
  )
}
