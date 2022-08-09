import React from 'react'
import { Icon, IconProps } from '@chakra-ui/react'

{/* 
export const CartIcon = (props: IconProps) => {
  const getColor = (color = undefined) => {
    return color === undefined ? '#454545' : color
  }
*/}
export const CartIcon = (props: IconProps) => {
  
  return (
    <Icon width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='none' {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M5.83203 17.5006C5.83203 16.5802 6.57822 15.834 7.4987 15.834C8.41917 15.834 9.16536 16.5802 9.16536 17.5006C9.16536 18.4211 8.41917 19.1673 7.4987 19.1673C6.57822 19.1673 5.83203 18.4211 5.83203 17.5006Z" fill='#454545'/>
      <path fillRule="evenodd" clipRule="evenodd" d="M15 17.5006C15 16.5802 15.7462 15.834 16.6667 15.834C17.5871 15.834 18.3333 16.5802 18.3333 17.5006C18.3333 18.4211 17.5871 19.1673 16.6667 19.1673C15.7462 19.1673 15 18.4211 15 17.5006Z" fill='#454545'/>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0.833333C0 0.373096 0.373096 0 0.833333 0H4.16666C4.56385 0 4.90584 0.280321 4.98379 0.669785L5.68369 4.16666H19.1667C19.415 4.16666 19.6504 4.27744 19.8087 4.46879C19.967 4.66015 20.0318 4.91214 19.9852 5.1561L18.6507 12.154C18.5364 12.7295 18.2233 13.2465 17.7663 13.6144C17.3115 13.9805 16.743 14.1758 16.1595 14.1667H8.07386C7.49031 14.1758 6.92183 13.9805 6.46706 13.6144C6.0102 13.2466 5.69719 12.7299 5.58277 12.1547C5.58272 12.1545 5.58282 12.1549 5.58277 12.1547L4.19066 5.19933C4.18501 5.17632 4.18032 5.15294 4.17662 5.12923L3.48359 1.66667H0.833333C0.373096 1.66667 0 1.29357 0 0.833333ZM6.01727 5.83333L7.21736 11.8293C7.25546 12.0211 7.35982 12.1935 7.51217 12.3161C7.66452 12.4387 7.85515 12.5039 8.05069 12.5001L8.06666 12.5H16.1667L16.1826 12.5001C16.3782 12.5039 16.5688 12.4387 16.7211 12.3161C16.8728 12.194 16.9769 12.0227 17.0154 11.832L18.1594 5.83333H6.01727Z" fill='#454545'/>
    </Icon>
  )
}
