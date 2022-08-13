import React from 'react'
import { Icon, IconProps } from '@chakra-ui/react'

export const ClipBoardIcon = (props: IconProps) => {
  const getColor = (color) => {
    return color === undefined ? '#454545' : color
  }


  return (
    <Icon viewBox='0 0 20 20' {...props}>
      <rect x="5.54541" y="5.54541" width="13.4545" height="13.4545" rx="4" fill="white" stroke={getColor(props.color)} strokeWidth="2"/>
      <rect x="1" y="1" width="13.4545" height="13.4545" rx="4" fill="white" stroke={getColor(props.color)} strokeWidth="2"/>
    </Icon>
  )
}
