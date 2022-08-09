import React from 'react'
import { IconButton } from '@chakra-ui/react'

import { ClipBoardIcon } from './Icons'

interface CopyToClipboardProps {
  copyFn?: () => void;
  color?: string
}

export const CopyToClipboard = ({ copyFn, color }: CopyToClipboardProps) => {
  return (
    <IconButton
      variant='outline'
      colorScheme='whiteAlpha'
      aria-label='Copy to clipboard'
      isRound={true}
      icon={<ClipBoardIcon boxSize={5} color={color} />}
      onClick={copyFn}
    />
  )
}
