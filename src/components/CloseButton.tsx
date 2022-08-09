import React from 'react'
import { IconButton, IconButtonProps } from '@chakra-ui/react'

import { XIcon } from './Icons/XIcon'

interface CloseButtonProps {
  closeFn: () => void;
  color?: string
}

export const CloseButton = ({ closeFn, color, ...rest }: CloseButtonProps & Partial<IconButtonProps>) => {
  return (
    <IconButton
      variant='unstyled'
      colorScheme=''
      aria-label='Close'
      isRound={true}
      icon={<XIcon boxSize={5} color={color} />}
      onClick={closeFn}
      {...rest}
    />
  )
}
